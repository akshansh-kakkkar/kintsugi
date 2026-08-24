import { db } from "@/db";
import { getSlackProfile } from "@/lib/auth-guard";
import { Kalam } from "next/font/google";
import { ProjectSearch } from "./projects-search";

const kalamFont = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const projects = await db.query.projects.findMany();

  const filteredProjects = query
    ? projects.filter((project) => {
        const haystack = [
          project.name,
          project.description,
          project.bannerUrl,
          project.userId,
          project.id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : projects;

  return (
    <div className={`min-h-screen px-6 py-10 sm:px-10 ${kalamFont.className}`}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-baseline justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold uppercase tracking-tight text-[#2A1A08]">
              Projects
            </h1>
            <p className="mt-1 text-lg text-[#C4B282]">
              {filteredProjects.length} projects
              {query ? " matched" : " created"}
              {query && projects.length !== filteredProjects.length && (
                <span className="text-[#69583C]"> of {projects.length}</span>
              )}
            </p>
          </div>
          <ProjectSearch defaultValue={q ?? ""} />
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#c9a030] bg-[#FDF2CB] px-6 py-16 text-center text-[#C4B282] text-2xl">
            No projects here yet
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#c9a030] bg-[#FDF2CB] px-6 py-16 text-center text-[#C4B282] text-2xl">
            No projects match &ldquo;{q}&rdquo;
          </div>
        ) : (
          <div className="w-full overflow-x-scroll rounded-sm border-2 border-dashed border-[#c9a030] bg-[#2A1A08] shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-dashed border-[#453416]">
                  <th className="whitespace-nowrap px-5 py-3 text-base font-normal text-[#69583C]">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-base font-normal text-[#69583C]">
                    Description
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-base font-normal text-[#69583C]">
                    Approved Seconds
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-base font-normal text-[#69583C]">
                    Banner
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-base font-normal text-[#69583C]">
                    User ID
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-base font-normal text-[#69583C]">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#453416]">
                {filteredProjects.map((project) => {
                  return (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-[#3A2C10]"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 text-lg text-[#F5E4B0]">
                        {project.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="text-sm text-[#69583C]">
                          {project.description}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="text-sm text-[#69583C]">
                          {project.approvedSeconds}s
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#69583C]">
                        {project.bannerUrl}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#69583C]">
                        {project.userId}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#69583C]">
                        {project.createdAt.toString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}