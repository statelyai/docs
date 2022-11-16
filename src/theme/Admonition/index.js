import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';
function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M17.289 3.883a3.006 3.006 0 0 0-4.251.004l-8.57 8.57a5.003 5.003 0 1 0 7.075 7.076l9.19-9.19a1 1 0 1 1 1.414 1.414l-9.19 9.19a7.004 7.004 0 0 1-9.904-9.904l8.57-8.57a5.008 5.008 0 0 1 7.079-.006 5.006 5.006 0 0 1 .006 7.08l-8.59 8.57a3.001 3.001 0 0 1-4.245-4.244l8.49-8.48a1 1 0 1 1 1.414 1.415l-8.49 8.48a1.002 1.002 0 0 0 .708 1.708c.266 0 .52-.105.708-.293l8.59-8.57a3.006 3.006 0 0 0-.004-4.25Z" clip-rule="evenodd"/>
    </svg>
  );
}
function TipIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M8 18a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 22a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM7.05 3.05A7 7 0 0 1 19 7.992a5.65 5.65 0 0 1-1.806 4.229c-.65.652-.987 1.235-1.12 1.96a1 1 0 1 1-1.968-.362c.226-1.23.825-2.164 1.687-3.026l.03-.029A3.65 3.65 0 0 0 17 8.017V8A5 5 0 0 0 7 8c0 .795.164 1.742 1.193 2.778a5.61 5.61 0 0 1 1.698 3.026 1 1 0 0 1-1.962.392 3.61 3.61 0 0 0-1.136-1.989C5.295 10.71 5 9.201 5 8a7 7 0 0 1 2.05-4.95Z" clip-rule="evenodd"/>
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M10.48 2.394a3 3 0 0 1 4.12 1.113L22.596 17.5l.001.002A3 3 0 0 1 20.001 22H4.004a3 3 0 0 1-2.621-4.498l.001-.002L9.38 3.507l.001-.002a3 3 0 0 1 1.099-1.111Zm1.51 1.592a1 1 0 0 0-.87.507l-.002.003L3.116 18.5a1 1 0 0 0 .875 1.5H20a1 1 0 0 0 .865-1.5l-.002-.004-8-14-.002-.003a1 1 0 0 0-.87-.507Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 8a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1ZM11 17a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 11a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1ZM11 8a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
    </svg>
  );
}
function CautionIcon() {
  return (
    <svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1ZM11 16a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z" clip-rule="evenodd"/></svg>
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
