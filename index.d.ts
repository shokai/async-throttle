type AsyncSingletonOption = {
  trailing?: boolean,
};

declare function singletonAsync<T extends (...args: any[]) => Promise<any>>(func: T, options?: AsyncSingletonOption): T;

export = singletonAsync;
  
