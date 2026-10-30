import { Link } from "react-router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import "~/styles/components/page-header.scss";

export interface Crumb {
  // Undefined while the label is still loading (renders a placeholder).
  label?: string;
  to?: string;
}

interface PageHeaderProps {
  crumbs: Crumb[];
  // Where the back arrow goes; omitted means no back arrow.
  backTo?: string;
  backLabel?: string;
}

// Where you are: an optional back arrow and the path to this page.
const PageHeader = ({ crumbs, backTo, backLabel = "Back" }: PageHeaderProps) => (
  <header className="page-header">
    {backTo && (
      <Link className="page-header-back" to={backTo} aria-label={backLabel}>
        <ArrowLeftIcon size={16} weight="bold" />
      </Link>
    )}

    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className="breadcrumb-item">
              {crumb.label === undefined ? (
                <span className="breadcrumb-placeholder" aria-label="Loading" />
              ) : crumb.to && !isLast ? (
                <Link className="breadcrumb-link" to={crumb.to}>
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current" aria-current={isLast ? "page" : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  </header>
);

export default PageHeader;
