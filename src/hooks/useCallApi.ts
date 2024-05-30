import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Observable, Subject, Subscription } from 'rxjs';
import { useMount } from './useMount';

export enum JobState {
  Standing = 'standing',
  Processing = 'processing',
  Success = 'success',
  Failed = 'Failed',
}

type Fn<Result = any> = (...args: any) => Observable<Result>;

export function useCallApi<T extends Fn>(fn: T) {
  const subject = useRef(new Subject<Observable<any>>());
  const [jobSubscription, setJobSubscription] = useState<Subscription>();

  const [state, setState] = useState<JobState>();
  const [result, setResult] = useState<ReturnType<T> extends Observable<infer R> ? R : any>();
  const [error, setError] = useState<any>();

  const processing = useMemo(() => state === JobState.Processing, [state]);

  const run = useCallback(
    (...args: Parameters<T>) => {
      setState(JobState.Processing);
      subject.current.next(fn(...(args as any[])));
    },
    [fn],
  );

  const cancel = useCallback(() => {
    jobSubscription?.unsubscribe();
    setState(JobState.Standing);
  }, [jobSubscription]);

  useMount(() => {
    if (subject.current.closed) {
      subject.current = new Subject();
    }

    subject.current.subscribe({
      next: (observable) => {
        setJobSubscription(
          observable.subscribe({
            next: setResult,
            complete: () => {
              setState(JobState.Success);
            },
            error: (error) => {
              setState(JobState.Failed);
              setError(error);
            },
          }),
        );
      },
    });

    return () => {
      subject.current.unsubscribe();
    };
  });

  useEffect(() => {
    return () => {
      jobSubscription?.unsubscribe();
    };
  }, [jobSubscription]);

  return {
    run,
    cancel,
    state,
    processing,
    result,
    error,
  };
}
