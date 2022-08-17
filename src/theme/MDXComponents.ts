// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import { StatelyEditor } from '../components/StatelyEditor/StatelyEditor';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "SandpackEditor" tag to our <SandpackEditor /> component!
  // `SandpackEditor` will receive all props that were passed to `SandpackEditor` in MDX
  StatelyEditor: StatelyEditor,
};
