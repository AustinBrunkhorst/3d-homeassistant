import { useEffect, useRef } from 'react';

interface CancellablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export function makeCancelable<T>(promise: Promise<T>): CancellablePromise<T> {
  let disconnected = false;

  return {
    promise: new Promise((resolve, reject) =>
      promise
        .then(result => {
          if (!disconnected) {
            resolve(result);
          }
        })
        .catch(error => {
          if (!disconnected) {
            reject(error);
          }
        })
    ),
    cancel() {
      disconnected = true;
    }
  };
}

export default function useCancellablePromise<T>() {
  const promises = useRef<CancellablePromise<T>[]>([]);

  useEffect(() => {
    return function cancel() {
      for (const promise of promises.current) {
        promise.cancel();
      }

      promises.current = [];
    };
  }, []);

  return function cancellableFactory(factory: () => Promise<T>) {
    const promise = factory();
    const handle = makeCancelable(promise);

    promises.current.push(handle);

    return handle.promise;
  };
}
