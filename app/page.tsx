import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-200 font-sans dark:bg-black">
      <main className="flex min-h-1/3 max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start rounded-2xl shadow-lg">
        {/* <BackgroundBoxesDemo /> */}
        <div className ="grid grid-cols-2 gap-8 place-items-center justify-center">
          <Button className="w-full" asChild variant="secondary" size="lg">
            <Link href="/ml-kem">
              ML-KEM / FIPS 203
            </Link>
          </Button>
          <Button className="w-full" asChild variant="secondary" size="lg">
            <Link href="/ml-dsa">
              ML-DSA / FIPS 204
            </Link>
          </Button>
          <Button className="w-full" asChild variant="secondary" size="lg">
            <Link href="/lll">
              LLL
            </Link>
          </Button>
          <Button className="w-full" asChild variant="secondary" size="lg">
            <Link href="/bkz">
              BKZ
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
