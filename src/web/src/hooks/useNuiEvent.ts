import { type RefObject, useEffect, useRef } from 'react';
import { noop } from '../lib/misc';

interface NuiMessageData<T = unknown> {
  action: string;
  data: T;
}

type NuiEventCallback<T> = (data: T) => void;

export const useNuiEvent = <T = unknown>(action: string, handler: (data: T) => void): void => {
  const handlerRef: RefObject<NuiEventCallback<T>> = useRef(noop);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const nuiEventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { action: eventAction, data } = event.data;

      if (handlerRef.current) {
        if (eventAction === action) {
          handlerRef.current(data);
        }
      }
    };
    window.addEventListener('message', nuiEventListener);

    return () => {
      window.removeEventListener('message', nuiEventListener);
    };
  }, [action]);
};
