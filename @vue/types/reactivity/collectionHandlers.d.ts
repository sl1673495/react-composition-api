export declare type CollectionTypes = IterableCollections | WeakCollections;
declare type IterableCollections = Map<any, any> | Set<any>;
declare type WeakCollections = WeakMap<any, any> | WeakSet<any>;
export declare const mutableCollectionHandlers: ProxyHandler<CollectionTypes>;
export declare const readonlyCollectionHandlers: ProxyHandler<CollectionTypes>;
export {};
