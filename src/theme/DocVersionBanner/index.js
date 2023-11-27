import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  useActivePlugin,
  useDocVersionSuggestions,
} from '@docusaurus/plugin-content-docs/client';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useDocsPreferredVersion,
  useDocsVersion,
} from '@docusaurus/theme-common/internal';
function UnreleasedVersionLabel({ siteTitle, versionMetadata }) {
  return (
    <Translate
      id="theme.docs.versions.unreleasedVersionLabel"
      description="The label used to tell the user that he's browsing an unreleased doc version"
      values={{
        siteTitle,
        versionLabel: <b>{versionMetadata.label}</b>,
      }}
    >
      {
        'This is unreleased documentation for {siteTitle} {versionLabel} version.'
      }
    </Translate>
  );
}
function UnmaintainedVersionLabel({ siteTitle, versionMetadata }) {
  return (
    <Translate
      id="theme.docs.versions.unmaintainedVersionLabel"
      description="The label used to tell the user that he's browsing an unmaintained doc version"
      values={{
        siteTitle,
        versionLabel: <b>{versionMetadata.label}</b>,
      }}
    >
      {
        'This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.'
      }
    </Translate>
  );
}
const BannerLabelComponents = {
  unreleased: UnreleasedVersionLabel,
  unmaintained: UnmaintainedVersionLabel,
};
function BannerLabel(props) {
  const BannerLabelComponent =
    BannerLabelComponents[props.versionMetadata.banner];
  return <BannerLabelComponent {...props} />;
}
function LatestVersionSuggestionLabel({ versionLabel, to, onClick }) {
  return (
    <Translate
      id="theme.docs.versions.latestVersionSuggestionLabel"
      description="The label used to tell the user to check the latest version"
      values={{
        versionLabel,
        latestVersionLink: (
          <b>
            <Link to={to} onClick={onClick}>
              {versionLabel}
            </Link>
          </b>
        ),
      }}
    >
      {'For {versionLabel}, see the {latestVersionLink} documentation.'}
    </Translate>
  );
}
function DocVersionBannerEnabled({ className, versionMetadata }) {
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { pluginId } = useActivePlugin({ failfast: true });
  const getVersionMainDoc = (version) =>
    version.docs.find((doc) => doc.id === version.mainDocId);
  const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);
  const { latestDocSuggestion, latestVersionSuggestion } =
    useDocVersionSuggestions(pluginId);
  // Try to link to same doc in latest version (not always possible), falling
  // back to main doc of latest version
  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);
  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        'alert admonition versionBanner alert--warning alert--version',
      )}
      role="alert"
    >
      <div className="versionBannerHeading">
        <span className="versionBannerIcon">
          <svg alt="" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.998-3.363c-.304 0-.564-.1-.782-.302a.979.979 0 0 1-.32-.733c0-.282.106-.523.32-.724a1.1 1.1 0 0 1 .782-.307c.303 0 .562.102.776.307a.952.952 0 0 1 .326.724.972.972 0 0 1-.326.733 1.093 1.093 0 0 1-.776.302Zm-1.026 8.313v-6.864h2.042v6.864h-2.042Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      <div className="versionBannerContent">
        <h2>
          <BannerLabel
            siteTitle={siteTitle}
            versionMetadata={versionMetadata}
          />
        </h2>
        <p>
          <LatestVersionSuggestionLabel
            versionLabel={latestVersionSuggestion.label}
            to={latestVersionSuggestedDoc.path}
            onClick={() =>
              savePreferredVersionName(latestVersionSuggestion.name)
            }
          />
        </p>
      </div>
    </div>
  );
}
export default function DocVersionBanner({ className }) {
  const versionMetadata = useDocsVersion();
  if (versionMetadata.banner) {
    return (
      <DocVersionBannerEnabled
        className={className}
        versionMetadata={versionMetadata}
      />
    );
  }
  return null;
}
