import { ThemeClassNames } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';
function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.44 11.05-9.19 9.19a6.003 6.003 0 1 1-8.49-8.49l8.57-8.57A4.006 4.006 0 0 1 18 8.84l-8.59 8.57a2.001 2.001 0 1 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}
function TipIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18h6m-5 4h4m1.09-8c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 1 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01m9.72 1-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2.001 2.001 0 0 0 1.73-3Z"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"/>
    </svg>
  );
}
function CautionIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"/>
    </svg>
  );
}
function XStateIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="m3.11 2.5 3.805.031c.37.003.717.175.944.467l13.594 17.528a.604.604 0 0 1-.477.974h-3.983c-.377 0-.732-.176-.96-.475l-3.791-5.192-4.196 5.209c-.23.29-.578.458-.947.458H3.105a.604.604 0 0 1-.474-.979l6.657-8.435L2.625 3.47a.604.604 0 0 1 .393-.965L3.11 2.5Zm17.859 0a.604.604 0 0 1 .48.979l-5.96 7.51c-.425-.333-3.724-3.088-.542-6.776l.095-.111.145-.168c.277-.325.71-.83.804-.944.315-.38.574-.456.941-.459L20.97 2.5Z"
      />
    </svg>
  );
}
function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        fillRule="nonzero"
        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm-3.066 8.365c-1.496 0-2.573.815-2.563 2.033-.003.994.694 1.553 1.825 1.812l.684.16c.719.166 1.042.36 1.048.728-.006.4-.38.678-1.016.678-.7 0-1.16-.326-1.195-.956h-1.515c.019 1.531 1.083 2.263 2.729 2.263 1.63 0 2.595-.738 2.602-1.981-.007-1.046-.713-1.685-2.004-1.97l-.563-.127c-.594-.128-.971-.326-.959-.716.004-.358.31-.617.924-.617.617 0 .956.278.997.745h1.515c-.013-1.224-.988-2.052-2.509-2.052Zm-3.12.09H7.28v1.284H9.27V18h1.56v-5.26h1.984v-1.285Z"
      />
    </svg>
  );
}
function StatelyIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <g fillRule="evenodd">
        <path d="M15.327 5.224a2.362 2.362 0 1 0 0-4.724 2.362 2.362 0 0 0 0 4.724M21.049 13.251v-.002L8.299.5a4.711 4.711 0 0 0 .01 6.67l4.058 4.057-.007.007 2.3 2.3a.463.463 0 0 1 .138.325.46.46 0 0 1-.148.331l-2.682 2.682a.46.46 0 0 1-.65 0l-2.69-2.69a.46.46 0 0 1 0-.65c1.835-1.959.465-4.304-.383-5.098l-.6-.6-5.376 5.377a.919.919 0 0 0 0 1.3l8.72 8.72a.919.919 0 0 0 1.3 0l8.702-8.702a.869.869 0 0 0 .058-1.278" />
      </g>
    </svg>
  );
}
function PartyIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10m8 3-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98-.7.1-1.22.72-1.22 1.43V7m2 6c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 3 14 9-14 9V3Z"/>
    </svg>
  );
}
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const AdmonitionConfigs = {
  note: {
    infimaClassName: 'secondary',
    iconComponent: NoteIcon,
    label: (
      <Translate
        id="theme.admonition.note"
        description="The default label used for the Note admonition (:::note)"
      >
        Note
      </Translate>
    ),
  },
  tip: {
    infimaClassName: 'tip',
    iconComponent: TipIcon,
    label: (
      <Translate
        id="theme.admonition.tip"
        description="The default label used for the Tip admonition (:::tip)"
      >
        Tip
      </Translate>
    ),
  },
  danger: {
    infimaClassName: 'danger',
    iconComponent: DangerIcon,
    label: (
      <Translate
        id="theme.admonition.danger"
        description="The default label used for the Danger admonition (:::danger)"
      >
        Danger
      </Translate>
    ),
  },
  info: {
    infimaClassName: 'info',
    iconComponent: InfoIcon,
    label: (
      <Translate
        id="theme.admonition.info"
        description="The default label used for the Info admonition (:::info)"
      >
        Info
      </Translate>
    ),
  },
  caution: {
    infimaClassName: 'warning',
    iconComponent: CautionIcon,
    label: (
      <Translate
        id="theme.admonition.caution"
        description="The default label used for the Caution admonition (:::caution)"
      >
        Caution
      </Translate>
    ),
  },
  xstate: {
    infimaClassName: 'xstate',
    iconComponent: XStateIcon,
    label: (
      <Translate
        id="theme.admonition.xstate"
        description="The default label used for the XState admonition (:::xstate)"
      >
        XState
      </Translate>
    ),
  },
  typescript: {
    infimaClassName: 'typescript',
    iconComponent: TypeScriptIcon,
    label: (
      <Translate
        id="theme.admonition.typescript"
        description="The default label used for the TypeScript admonition (:::typescript)"
      >
        TypeScript
      </Translate>
    ),
  },
  studio: {
    infimaClassName: 'studio',
    iconComponent: StatelyIcon,
    label: (
      <Translate
        id="theme.admonition.studio"
        description="The default label used for the Stately Studio admonition (:::studio)"
      >
        Studio
      </Translate>
    ),
  },
  warningxstate: {
    infimaClassName: 'warningxstate',
    iconComponent: XStateIcon,
    label: (
      <Translate
        id="theme.admonition.warningxstate"
        description="The default label used for the XState warning admonition (:::warningxstate)"
      >
        XState Warning
      </Translate>
    ),
  },
  new: {
    infimaClassName: 'new',
    iconComponent: PartyIcon,
    label: (
      <Translate
        id="theme.admonition.new"
        description="The default label used for the XState warning admonition (:::new)"
      >
        New
      </Translate>
    ),
  },
  video: {
    infimaClassName: 'video',
    iconComponent: PlayIcon,
    label: (
      <Translate
        id="theme.admonition.video"
        description="The default label used for the XState warning admonition (:::video)"
      >
        Video
      </Translate>
    ),
  },
};
// Legacy aliases, undocumented but kept for retro-compatibility
const aliases = {
  secondary: 'note',
  important: 'info',
  success: 'tip',
  warning: 'danger',
};
function getAdmonitionConfig(unsafeType) {
  const type = aliases[unsafeType] ?? unsafeType;
  const config = AdmonitionConfigs[type];
  if (config) {
    return config;
  }
  console.warn(
    `No admonition config found for admonition type "${type}". Using Info as fallback.`
  );
  return AdmonitionConfigs.info;
}
// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children) {
  const items = React.Children.toArray(children);
  const mdxAdmonitionTitle = items.find(
    (item) =>
      React.isValidElement(item) && item.props?.mdxType === 'mdxAdmonitionTitle'
  );
  const rest = <>{items.filter((item) => item !== mdxAdmonitionTitle)}</>;
  return {
    mdxAdmonitionTitle,
    rest,
  };
}
function processAdmonitionProps(props) {
  const { mdxAdmonitionTitle, rest } = extractMDXAdmonitionTitle(
    props.children
  );
  return {
    ...props,
    title: props.title ?? mdxAdmonitionTitle,
    children: rest,
  };
}
export default function Admonition(props) {
  const {
    children,
    type,
    title,
    icon: iconProp,
  } = processAdmonitionProps(props);
  const typeConfig = getAdmonitionConfig(type);
  const titleLabel = title ?? typeConfig.label;
  const { iconComponent: IconComponent } = typeConfig;
  const icon = iconProp ?? <IconComponent />;
  return (
    <aside
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(props.type),
        'alert',
        `alert--${typeConfig.infimaClassName}`,
        styles.admonition
      )}
    >
      <div className={styles.admonitionHeading}>
        <span className={styles.admonitionIcon}>{icon}</span>
      </div>
      <div className={styles.admonitionContent}>{children}</div>
    </aside>
  );
}
