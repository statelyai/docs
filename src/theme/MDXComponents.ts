// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import ThemedImage from '@theme/ThemedImage';
import * as LucideIcons from 'lucide-react';
import EmbedMachine from '../components/EmbedMachine';
import SkipDownLink from '../components/SkipDownLink';
import Tweet from '../components/embeds/Tweet';
import YouTube from '../components/embeds/YouTube';

export default {
  ...MDXComponents,
  ...LucideIcons,
  SkipDownLink,
  Tweet,
  YouTube,
  EmbedMachine,
  ThemedImage,
};
