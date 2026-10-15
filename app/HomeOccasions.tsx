import Link from "next/link";
import LazyLottie from "@/components/LazyLottie";
import type { Occasion } from "@/lib/occasions";

const lottieUrl = (occasion: Occasion) => {
  const lottie = occasion.default_lottie;
  if (!lottie) return null;
  return (lottie.source_type === "local" ? lottie.file_path : lottie.remote_url) || null;
};

// Rendered on the server with the occasions already fetched, so the tiles are
// in the HTML and the homepage doesn't need the Supabase client to show them.
// Each tile loads its own animation when it scrolls near the screen.
export default function HomeOccasions({ occasions }: { occasions: Occasion[] }) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            What moments do you want to celebrate?
          </h2>
          <p className="text-xl text-white opacity-90">
            Send beautiful digital cards solo or gather messages from everyone for birthdays, milestones, and more.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
          {occasions.length > 0 ? (
            occasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={`/boards/create?occasion=${occasion.short_id}`}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-all hover:scale-105"
              >
                {lottieUrl(occasion) ? (
                  <LazyLottie filePath={lottieUrl(occasion)!} className="w-20 h-20" />
                ) : (
                  <div className="w-20 h-20 bg-[#F7FAFC] rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                )}
                <h3 className="text-center font-semibold text-[#0B1F2A] min-h-[3rem] flex items-center justify-center">
                  {occasion.name}
                </h3>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-white">
              <p>No occasions available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/boards/create" className="inline-flex items-center gap-2 text-white text-lg font-semibold hover:gap-4 transition-all">
            See all occasions
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
