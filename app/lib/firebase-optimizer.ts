import { adminDb } from './firebase-admin';
import type { DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';

// Cache para queries frecuentes
const queryCache = new Map<string, {
  data: any;
  timestamp: number;
  ttl: number;
}>();

interface QueryOptions {
  collection: string;
  filters?: Array<{
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: any;
  }>;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
  select?: string[];
  cacheTTL?: number; // Time to live en milisegundos
}

export class OptimizedFirebaseQueries {
  
  /**
   * Ejecuta una consulta optimizada con cache y batching
   */
  static async executeQuery(options: QueryOptions): Promise<{
    docs: any[];
    totalCount?: number;
    hasMore?: boolean;
    cached?: boolean;
  }> {
    const {
      collection,
      filters = [],
      orderBy,
      limit,
      offset,
      select,
      cacheTTL = 30000 // 30 segundos por defecto
    } = options;

    // Crear clave de cache
    const cacheKey = this.createCacheKey(options);
    
    // Verificar cache
    const cached = queryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      return { ...cached.data, cached: true };
    }

    try {
      let query: any = adminDb.collection(collection);

      // Aplicar filtros
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

      // Aplicar ordenamiento
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
      }

      // Aplicar paginación
      if (offset) {
        query = query.offset(offset);
      }
      if (limit) {
        query = query.limit(limit);
      }

      // Aplicar selección de campos
      if (select && select.length > 0) {
        query = query.select(...select);
      }

      const [snapshot, totalCount] = await Promise.all([
        query.get() as Promise<QuerySnapshot>,
        limit ? this.getTotalCount(collection, filters) : Promise.resolve(undefined)
      ]);

      const docs = snapshot.docs.map((doc: DocumentSnapshot) => ({
        _id: doc.id,
        ...doc.data()
      }));

      const result = {
        docs,
        totalCount,
        hasMore: limit ? docs.length === limit : false
      };

      // Guardar en cache
      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl: cacheTTL
      });

      // Limpiar cache antiguo ocasionalmente
      if (Math.random() < 0.1) {
        this.cleanExpiredCache();
      }

      return result;

    } catch (error) {
      console.error('Error executing optimized query:', error);
      throw error;
    }
  }

  /**
   * Obtiene conteo total de documentos (optimizado)
   */
  private static async getTotalCount(
    collection: string, 
    filters: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: any; }>
  ): Promise<number> {
    const cacheKey = `count_${collection}_${JSON.stringify(filters)}`;
    const cached = queryCache.get(cacheKey);
    
    // Cache más largo para conteos (2 minutos)
    if (cached && (Date.now() - cached.timestamp) < 120000) {
      return cached.data;
    }

    try {
      let query: any = adminDb.collection(collection);
      
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

      const snapshot = await query.get();
      const count = snapshot.size;

      queryCache.set(cacheKey, {
        data: count,
        timestamp: Date.now(),
        ttl: 120000 // 2 minutos
      });

      return count;
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  }

  /**
   * Ejecuta operaciones de escritura optimizadas con batch
   */
  static async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    id?: string;
    data?: any;
  }>): Promise<void> {
    if (operations.length === 0) return;

    const batch = adminDb.batch();
    
    operations.forEach(op => {
      const ref = op.id 
        ? adminDb.collection(op.collection).doc(op.id)
        : adminDb.collection(op.collection).doc();

      switch (op.type) {
        case 'create':
          batch.create(ref, op.data);
          break;
        case 'update':
          batch.update(ref, op.data);
          break;
        case 'delete':
          batch.delete(ref);
          break;
      }
    });

    await batch.commit();
    
    // Invalidar cache relacionado
    const collectionsSet = new Set(operations.map(op => op.collection));
    const collections = Array.from(collectionsSet);
    this.invalidateCacheForCollections(collections);
  }

  /**
   * Obtiene documento por ID con cache
   */
  static async getDocumentById(
    collection: string, 
    id: string,
    cacheTTL: number = 60000 // 1 minuto
  ): Promise<any | null> {
    const cacheKey = `doc_${collection}_${id}`;
    const cached = queryCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      return cached.data;
    }

    try {
      const doc = await adminDb.collection(collection).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = {
        _id: doc.id,
        ...doc.data()
      };

      queryCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL
      });

      return data;
    } catch (error) {
      console.error('Error getting document by ID:', error);
      throw error;
    }
  }

  /**
   * Actualiza un documento e invalida cache relacionado
   */
  static async updateDocument(
    collection: string,
    id: string,
    data: any
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      await adminDb.collection(collection).doc(id).update({
        ...data,
        updatedAt: now
      });

      // Invalidar cache relacionado
      this.invalidateCacheForCollections([collection]);
      
      // Invalidar cache específico del documento
      const docCacheKey = `doc_${collection}_${id}`;
      queryCache.delete(docCacheKey);
      
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Crea clave de cache única
   */
  private static createCacheKey(options: QueryOptions): string {
    const keyParts = [
      options.collection,
      JSON.stringify(options.filters || []),
      JSON.stringify(options.orderBy || {}),
      options.limit || 'all',
      options.offset || 0,
      JSON.stringify(options.select || [])
    ];
    
    return keyParts.join('_');
  }

  /**
   * Limpia cache expirado
   */
  private static cleanExpiredCache(): void {
    const now = Date.now();
    queryCache.forEach((value, key) => {
      if (now - value.timestamp > value.ttl) {
        queryCache.delete(key);
      }
    });
  }

  /**
   * Invalida cache para colecciones específicas
   */
  private static invalidateCacheForCollections(collections: string[]): void {
    queryCache.forEach((value, key) => {
      const shouldInvalidate = collections.some(collection => 
        key.startsWith(collection) || key.includes(`_${collection}_`)
      );
      
      if (shouldInvalidate) {
        queryCache.delete(key);
      }
    });
  }

  /**
   * Obtiene estadísticas del cache
   */
  static getCacheStats(): {
    size: number;
    hitRate: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const now = Date.now();
    let oldest = now;
    let newest = 0;
    
    queryCache.forEach((value) => {
      if (value.timestamp < oldest) oldest = value.timestamp;
      if (value.timestamp > newest) newest = value.timestamp;
    });

    return {
      size: queryCache.size,
      hitRate: 0, // TODO: Implementar tracking de hit rate
      oldestEntry: now - oldest,
      newestEntry: now - newest
    };
  }

  /**
   * Limpia todo el cache
   */
  static clearCache(): void {
    queryCache.clear();
  }
}

// Exportar instancia para uso directo
export const firebaseOptimizer = OptimizedFirebaseQueries;
