import { useEffect, useState } from "react";
import useWire from "./useWire";

export type ErrorBagItem = string[] | null;

export function useErrorBag() {
    const $wire = useWire();
    const [errors, setErrors] = useState($wire.__instance.snapshot.memo.errors);

    // Listen to requests, and grab the error bag from them after completion
    useEffect(() => {
        $wire.$hook(
            "commit",
            ({ component, commit, respond, succeed, fail }) => {
                succeed(({ snapshot, effect }) => {
                    // snapshot here is JSON encoded, so instead of parsing it we grab it from the $wire instance
                    // Since its already parsed there, so no need to duplicate the work.
                    setErrors($wire.__instance.snapshot.memo.errors);
                });
            }
        );
    }, [$wire]);

    return errors;
}
