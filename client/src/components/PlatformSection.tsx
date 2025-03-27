import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Platform } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const PlatformSection: React.FC = () => {
  const { data: platforms = [], isLoading } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  if (isLoading) {
    return (
      <section className="mb-10">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold font-poppins mb-6">Popular Platforms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <div key={platform.id} className="bg-[#1E1E1E] rounded-lg p-5 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" 
                   style={{ backgroundColor: `${platform.color}20` }}>
                <i className={`${platform.icon} text-3xl`} style={{ color: platform.color }}></i>
              </div>
              <h3 className="text-lg font-semibold font-montserrat mb-2">{platform.name} Games</h3>
              <p className="text-gray-400 text-sm mb-4">{platform.description}</p>
              <Link href={`/discover?platform=${platform.id}`}>
                <a className="hover:underline text-sm font-medium" style={{ color: platform.color }}>
                  Browse Games <i className="fas fa-arrow-right ml-1"></i>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlatformSection;
