import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';
function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12.707 4.222a3 3 0 0 1 4.243 4.242l-7.072 7.072a1 1 0 1 1-1.414-1.415l7.071-7.07-1.414-1.415-7.07 7.071a3 3 0 1 0 4.242 4.243l7.07-7.071a5 5 0 0 0-7.07-7.071l-7.071 7.07a7 7 0 0 0 9.9 9.9l7.07-7.07-1.414-1.415-7.071 7.071a5 5 0 0 1-7.071-7.071l7.07-7.071Z"/>
    </svg>
  );
}
function TipIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M17.177 15.1c-.68.577-1.177 1.38-1.177 2.272V19H8v-1.628c0-.893-.497-1.695-1.177-2.272a8 8 0 1 1 10.353 0ZM14.105 3.919A5.5 5.5 0 0 0 12 3.5v2A3.5 3.5 0 0 1 15.5 9h2a5.5 5.5 0 0 0-3.395-5.081Z" clip-rule="evenodd"/><path d="M8 21v2h8v-2H8Z"/>
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 1L0.453125 21H23.5471L12.0001 1ZM13.0668 9.63182L12.8798 14.0065H11.1252L10.9334 9.63182H13.0668ZM12.0025 17.5746C11.6861 17.5746 11.4144 17.4628 11.1875 17.2391C10.9606 17.0121 10.8488 16.7405 10.8519 16.4241C10.8488 16.1109 10.9606 15.8424 11.1875 15.6187C11.4144 15.395 11.6861 15.2831 12.0025 15.2831C12.3061 15.2831 12.573 15.395 12.8031 15.6187C13.0332 15.8424 13.1499 16.1109 13.1531 16.4241C13.1499 16.635 13.094 16.8284 12.9853 17.0042C12.8798 17.1767 12.7408 17.3158 12.5682 17.4212C12.3956 17.5235 12.2071 17.5746 12.0025 17.5746Z" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.998-3.363c-.304 0-.564-.1-.782-.302a.979.979 0 0 1-.32-.733c0-.282.106-.523.32-.724a1.1 1.1 0 0 1 .782-.307c.303 0 .562.102.776.307a.952.952 0 0 1 .326.724.972.972 0 0 1-.326.733 1.093 1.093 0 0 1-.776.302Zm-1.026 8.313v-6.864h2.042v6.864h-2.042Z" clip-rule="evenodd"/>
    </svg>
  );
}
function CautionIcon() {
  return (
    <svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-8.933-4.868-.187 6.375h-1.755l-.192-6.375h2.134Zm-1.065 9.943a1.12 1.12 0 0 1-.815-.336 1.095 1.095 0 0 1-.335-.815 1.074 1.074 0 0 1 .335-.805 1.12 1.12 0 0 1 .815-.336c.304 0 .57.112.801.336a1.1 1.1 0 0 1 .182 1.385 1.24 1.24 0 0 1-.417.417 1.09 1.09 0 0 1-.566.154Z" clip-rule="evenodd"/></svg>
  );
}
function XStateIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="m3.11 2.5 3.805.031c.37.003.717.175.944.467l13.594 17.528a.604.604 0 0 1-.477.974h-3.983c-.377 0-.732-.176-.96-.475l-3.791-5.192-4.196 5.209c-.23.29-.578.458-.947.458H3.105a.604.604 0 0 1-.474-.979l6.657-8.435L2.625 3.47a.604.604 0 0 1 .393-.965L3.11 2.5Zm17.859 0a.604.604 0 0 1 .48.979l-5.96 7.51c-.425-.333-3.724-3.088-.542-6.776l.095-.111.145-.168c.277-.325.71-.83.804-.944.315-.38.574-.456.941-.459L20.97 2.5Z"/>
    </svg>
  );
}
function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="nonzero" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm-3.066 8.365c-1.496 0-2.573.815-2.563 2.033-.003.994.694 1.553 1.825 1.812l.684.16c.719.166 1.042.36 1.048.728-.006.4-.38.678-1.016.678-.7 0-1.16-.326-1.195-.956h-1.515c.019 1.531 1.083 2.263 2.729 2.263 1.63 0 2.595-.738 2.602-1.981-.007-1.046-.713-1.685-2.004-1.97l-.563-.127c-.594-.128-.971-.326-.959-.716.004-.358.31-.617.924-.617.617 0 .956.278.997.745h1.515c-.013-1.224-.988-2.052-2.509-2.052Zm-3.12.09H7.28v1.284H9.27V18h1.56v-5.26h1.984v-1.285Z"/>
    </svg>
  );
}
function StatelyIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <g fill-rule="evenodd"><path d="M15.327 5.224a2.362 2.362 0 1 0 0-4.724 2.362 2.362 0 0 0 0 4.724M21.049 13.251v-.002L8.299.5a4.711 4.711 0 0 0 .01 6.67l4.058 4.057-.007.007 2.3 2.3a.463.463 0 0 1 .138.325.46.46 0 0 1-.148.331l-2.682 2.682a.46.46 0 0 1-.65 0l-2.69-2.69a.46.46 0 0 1 0-.65c1.835-1.959.465-4.304-.383-5.098l-.6-.6-5.376 5.377a.919.919 0 0 0 0 1.3l8.72 8.72a.919.919 0 0 0 1.3 0l8.702-8.702a.869.869 0 0 0 .058-1.278"/></g>
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
    infimaClassName: 'tip',
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
      <div className={styles.admonitionHeading}>
        <span className={styles.admonitionIcon}>{icon}</span>
      </div>
      <div className={styles.admonitionContent}>{children}</div>
    </aside>
  );
}
