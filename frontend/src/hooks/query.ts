import { useQuery } from "@tanstack/react-query";

export const useFetchTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });
};
