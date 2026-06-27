"use client";

import { useMemo, useState } from "react";
import type { ProjectCard } from "@/types/content";
import {
  WORK_CATEGORIES,
  countProjectsByCategory,
  getCategoryShortLabel,
  projectMatchesCategory,
  type WorkCategoryFilter
} from "@/lib/workCategories";
import { ProjectCard as ProjectCardComponent } from "@/components/ProjectCard";

type Props = {
  projects: ProjectCard[];
};

export function WorkBrowser({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<WorkCategoryFilter>("All");

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured).slice(0, 6),
    [projects]
  );

  const filteredProjects = useMemo(
    () => projects.filter((project) => projectMatchesCategory(project, activeFilter)),
    [projects, activeFilter]
  );

  return (
    <div className="work-browser">
      {featuredProjects.length ? (
        <section className="work-browser-section" aria-labelledby="featured-work-heading">
          <div className="work-browser-section-header">
            <h2 id="featured-work-heading" className="work-browser-heading">
              Featured Work
            </h2>
            <p className="work-browser-subheading">
              Selected projects that represent the breadth of my design and product work.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCardComponent key={project._id} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="work-browser-section" aria-labelledby="browse-work-heading">
        <div className="work-browser-section-header">
          <h2 id="browse-work-heading" className="work-browser-heading">
            Browse work
          </h2>
          <p className="work-browser-subheading">
            Filter by category to explore digital products, websites, brand identity, and more.
          </p>
        </div>

        <div className="work-filter-scroll no-scrollbar">
          <div className="work-filter-tabs" role="group" aria-label="Filter projects by category">
            {WORK_CATEGORIES.map((category) => {
              const count = countProjectsByCategory(projects, category);
              const isActive = activeFilter === category;
              const shortLabel = getCategoryShortLabel(category);
              const hasShortLabel = shortLabel !== category;

              return (
                <button
                  key={category}
                  type="button"
                  className={`work-filter-tab${isActive ? " work-filter-tab--active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(category)}
                >
                  <span
                    className={`work-filter-tab-label work-filter-tab-label--full${
                      hasShortLabel ? " work-filter-tab-label--has-short" : ""
                    }`}
                  >
                    {category}
                  </span>
                  {hasShortLabel ? (
                    <span className="work-filter-tab-label work-filter-tab-label--short">
                      {shortLabel}
                    </span>
                  ) : null}
                  <span className="work-filter-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredProjects.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCardComponent key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No projects match this category yet. Try another filter or check back soon.
          </div>
        )}
      </section>
    </div>
  );
}
