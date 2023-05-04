import React from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import styles from './styles.module.css';
export default function BlogPostItemFooter() {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {tags, title, editUrl, hasTruncateMarker} = metadata;
  // A post is truncated if it's in the "list view" and it has a truncate marker
  const truncatedPost = !isBlogPostPage && hasTruncateMarker;
  const tagsExists = tags.length > 0;
  const renderFooter = tagsExists || truncatedPost || editUrl;
  if (!renderFooter) {
    return null;
  }
  return (
    <div
      className={clsx(
        'row post-footer docusaurus-mt-lg',
        isBlogPostPage && styles.blogPostFooterDetailsFull,
      )}>

      {isBlogPostPage && tagsExists && (
        <p className={clsx('col', {'col--9': truncatedPost})}>
          <TagsListInline tags={tags} />
        </p>
      )}

      {isBlogPostPage && editUrl && (
        <p className="col margin-top--sm">
          <EditThisPage editUrl={editUrl} />
        </p>
      )}

      {truncatedPost && (
        <p
          className={clsx('col', {
            'col--3': tagsExists,
          })}>
          <ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
        </p>
      )}
    </div>
  );
}
