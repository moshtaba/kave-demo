'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <h2>Something went wrong!</h2>
          <button className="mt-5 bg-blue-500 rounded p-3" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}