import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';
function NoteIcon() {
  return (
    <svg viewBox="0 0 14 16">
      <path
        fillRule="evenodd"
        d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"
      />
    </svg>
  );
}
function TipIcon() {
  return (
    <svg viewBox="0 0 12 16">
      <path
        fillRule="evenodd"
        d="M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"
      />
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg viewBox="0 0 12 16">
      <path
        fillRule="evenodd"
        d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"
      />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 14 16">
      <path
        fillRule="evenodd"
        d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"
      />
    </svg>
  );
}
function CautionIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <path
        fillRule="evenodd"
        d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"
      />
    </svg>
  );
}
function XStateIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M.5 0h3.2c.3 0 .6.2.8.4l11.4 14.7c.3.3 0 .8-.4.8h-3.3a1 1 0 0 1-.9-.4l-3.1-4.3-3.5 4.3a1 1 0 0 1-.8.4H.5a.5.5 0 0 1-.4-.8l5.6-7L0 .7C-.2.5.1 0 .5 0Zm15 0c.4 0 .7.5.4.8l-5 6.3c-.4-.3-3.1-2.6-.5-5.7l1-1c.2-.3.4-.4.7-.4h3.4Z"/>
    </svg>
  );
}
function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <path fill-rule="nonzero" d="M16 0v16H0V0h16Zm-3 7.4h-1.3c-.9.1-1.5.7-1.6 1.5v1c0 .3.2.6.4.8.3.3.7.6 1.5 1 .8.2 1 .4 1.1.6l.1.4c0 .2 0 .3-.2.4-.3.3-1 .4-1.5.1-.2 0-.5-.4-.6-.6l-.1-.1-.5.3-.5.2v.1l-.2.1s.2.5.4.6c.4.4 1 .7 1.6.9h1.2c1-.2 1.6-.6 1.8-1.3.2-.6.2-1.4-.2-2-.3-.4-.8-.7-2-1.2l-.8-.6-.1-.3c0-.5.3-.7.8-.7.3 0 .5.2.7.5l.2.1 1-.7c0-.1-.1-.4-.3-.5a2 2 0 0 0-1-.6Zm-5.1 0H3.5V8.7h2.1v6h1.5v-6h2V7.4H8Z"/>
    </svg>
  );
}
function StatelyIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <g fill-rule="evenodd">
        <path d="M9.3 3.3a1.6 1.6 0 1 0 0-3.3 1.6 1.6 0 0 0 0 3.3M13.3 8.9 4.3 0a3.3 3.3 0 0 0 0 4.6l3 2.9L8.7 9l.1.2-.1.2-1.9 1.9c0 .1-.3.1-.4 0L4.6 9.5a.3.3 0 0 1 0-.4C6 7.7 5 6 4.3 5.5L4 5.1.2 8.8c-.3.3-.3.7 0 1l6 6c.3.3.7.3 1 0l6-6a.6.6 0 0 0 0-1"/>
      </g>
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
        description="The default label used for the Note admonition (:::note)">
        Note
      </Translate>
    ),
  },
  tip: {
    infimaClassName: 'success',
    iconComponent: TipIcon,
    label: (
      <Translate
        id="theme.admonition.tip"
        description="The default label used for the Tip admonition (:::tip)">
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
        description="The default label used for the Danger admonition (:::danger)">
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
        description="The default label used for the Info admonition (:::info)">
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
        description="The default label used for the Caution admonition (:::caution)">
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
        description="The default label used for the XState admonition (:::xstate)">
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
        description="The default label used for the TypeScript admonition (:::typescript)">
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
        description="The default label used for the Stately Studio admonition (:::studio)">
        Studio
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
    `No admonition config found for admonition type "${type}". Using Info as fallback.`,
  );
  return AdmonitionConfigs.info;
}
// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children) {
  const items = React.Children.toArray(children);
  const mdxAdmonitionTitle = items.find(
    (item) =>
      React.isValidElement(item) &&
      item.props?.mdxType === 'mdxAdmonitionTitle',
  );
  const rest = <>{items.filter((item) => item !== mdxAdmonitionTitle)}</>;
  return {
    mdxAdmonitionTitle,
    rest,
  };
}
function processAdmonitionProps(props) {
  const {mdxAdmonitionTitle, rest} = extractMDXAdmonitionTitle(props.children);
  return {
    ...props,
    title: props.title ?? mdxAdmonitionTitle,
    children: rest,
  };
}
export default function Admonition(props) {
  const {children, type, title, icon: iconProp} = processAdmonitionProps(props);
  const typeConfig = getAdmonitionConfig(type);
  const titleLabel = title ?? typeConfig.label;
  const {iconComponent: IconComponent} = typeConfig;
  const icon = iconProp ?? <IconComponent />;
  return (
    <aside
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(props.type),
        'alert',
        `alert--${typeConfig.infimaClassName}`,
        styles.admonition,
      )}>
      <h2 className={styles.admonitionHeading}>
        <span className={styles.admonitionIcon}>{icon}</span>
        {titleLabel}
      </h2>
      <div className={styles.admonitionContent}>{children}</div>
    </aside>
  );
}
