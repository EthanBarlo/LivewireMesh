# Changelog

All notable changes to `LivewireMesh` will be documented in this file.

## v0.5.7 - 2025-07-17

Added a new `useErrorBag` hook.
Which makes the error bag from laravel validation available for use.

```tsx
const $wire = useWire();
const [userName, setUserName] = useEntangle<string>('user_name');
const errors = useErrorBag();

useEffect(() => {
    console.log({
        errors
    })
}, [errors]);


return <> 
{/* ....... */}
<TextInput value={userName} onChange={setUserName} hasErrors={errors['user_name'] !== null}/>
<ErrorMessage error={errors['user_name']}/>

<Button onClick={() => $wire.save()}>Save</Button>
</>

```
Multiple errors can be returned,
So we also have a provided type, that can be used to help with the ErrorMessage component

```tsx
import { ErrorBagItem } from '@livewiremesh/react/hooks/useErrorBag';

interface IError extends React.HTMLProps<HTMLParagraphElement> {
    error?: ErrorBagItem;
}
const Error: React.FC<IError> = ({ message, error, className, ...props }) => {
    if (!error) return null;
    return (
        <p className={cn('text-red-500 error', className)} {...props}>
            {error &&
                error.map((item) => (
                    <span key={item} className="block">
                        {item}
                    </span>
                ))}
        </p>
    );
};

export default Error;

```
## v0.5.6 - 2025-07-17

Updated useEntangle hook to accept generics for the data type.

```tsx
const [count, setCount] = useEntangle<number>('count')


```
## v0.5.5 - 2025-05-15

### What's Changed

- [Resolved bug where assets would only load for the first component on the page.](https://github.com/EthanBarlo/LivewireMesh/commit/01281b5ee811a67a11fa2bd884c1ed0d0ef47c15)
- [Added Debug Logs](https://github.com/EthanBarlo/LivewireMesh/commit/d5fde4e51629678ece0ce18963d6da329443e026)

* Bump dependabot/fetch-metadata from 2.3.0 to 2.4.0 by @dependabot in https://github.com/EthanBarlo/LivewireMesh/pull/2

**Full Changelog**: https://github.com/EthanBarlo/LivewireMesh/compare/v0.5.4...v0.5.5

## v0.5.3 - 2025-02-04

### What's Changed

* Bump aglipanci/laravel-pint-action from 2.4 to 2.5 by @dependabot in https://github.com/EthanBarlo/LivewireMesh/pull/1
* Resolved unmount error caused by duplicate render calls

### New Contributors

* @dependabot made their first contribution in https://github.com/EthanBarlo/LivewireMesh/pull/1

**Full Changelog**: https://github.com/EthanBarlo/LivewireMesh/compare/v0.5.2...v0.5.3

## v0.5.2 - 2025-01-29

**Full Changelog**: https://github.com/EthanBarlo/LivewireMesh/compare/v0.5.1...v0.5.2

## v0.5.1 - 2025-01-29

**Full Changelog**: https://github.com/EthanBarlo/LivewireMesh/commits/v0.5.1

## v0.5.0 | Initial Release - 2025-01-29

**Full Changelog**: https://github.com/EthanBarlo/LivewireMesh/commits/v0.5.0
