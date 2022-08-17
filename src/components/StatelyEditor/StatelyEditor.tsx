import {
  Sandpack,
  SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import React from 'react';
import { createFileMap } from './createFileMap';

export const StatelyEditor = ({
  children,
  dependencies = {},
  template = 'vanilla-ts',
}: {
  children: JSX.Element;
  dependencies: { [key: string]: string };
  template: SandpackPredefinedTemplate;
}) => {
  const { colorMode } = useColorMode();
  const files = createFileMap(children);

  return (
    <Sandpack
      template={template}
      files={files}
      options={{
        activeFile: Object.keys(files)[0],
        autorun: true,
        showLineNumbers: true,
        showNavigator: false,
      }}
      customSetup={{
        dependencies: {
          ...dependencies,
          xstate: 'latest',
          '@xstate/react': 'latest',
        },
      }}
      theme={colorMode === 'dark' ? 'dark' : 'light'}
    />
  );
};
