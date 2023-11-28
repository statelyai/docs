// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import ThemedImage from '@theme/ThemedImage';
import * as LucideIcons from 'lucide-react';
import { Announcement } from '../components/Announcement';
import EmbedMachine from '../components/EmbedMachine';
import Tweet from '../components/embeds/Tweet';
import YouTube from '../components/embeds/YouTube';

export default {
  ...MDXComponents,
  ...LucideIcons,
  Announcement,
  Tweet,
  YouTube,
  EmbedMachine,
  ThemedImage,
  Tabs,
  TabItem,
};
