import Link from 'next/link';
import { ultra } from '@/app/ui/fonts'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        <div
  className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-gradient-text"
  style={{
    backgroundSize: '200% 200%',
  }}
>
  <Link href='/blog' className={`${ultra.className} text-3xl`}>Respectful Mother</Link>
  <span/>
</div>

      </main>
      {/*<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>*/}
    </div>
  );
}
