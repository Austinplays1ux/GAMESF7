import { useQuery } from "@tanstack/react-query";
import { Platform } from "@/types";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const categories = [
    { id: "featured", name: "Featured", icon: "fa-star" },
    { id: "all", name: "All Games", icon: "fa-gamepad" },
    ...platforms.map(platform => ({
      id: platform.id.toString(),
      name: platform.name,
      icon: platform.icon
    }))
  ];

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium ${
              activeCategory === category.id
                ? "bg-[#007AF4] hover:bg-opacity-90"
                : "bg-[#1E1E1E] hover:bg-[#2A2A2A]"
            } focus:outline-none transition-colors`}
            onClick={() => onCategoryChange(category.id)}
          >
            <i className={`fas ${category.icon} mr-2`}></i>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
