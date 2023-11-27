import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { useDocById } from '@docusaurus/theme-common/internal';
import clsx from 'clsx';
import styles from './styles.module.css';

function CardContainer({ href, children }) {
  return (
    <Link href={href} className={clsx('card link-box', styles.cardContainer)}>
      {children}
    </Link>
  );
}
function CardLayout({ href, title, description }) {
  return (
    <CardContainer href={href}>
      <h2 className={clsx('card-heading', styles.cardTitle)}>{title}</h2>
      {description && (
        <p className={clsx('card-text', styles.cardDescription)}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}
function CardCategory({ item }) {
  const href = item.href;
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      href={href}
      title={item.label}
      description={
        item.description ??
        translate(
          {
            message: '{count} items',
            id: 'theme.docs.DocCard.categoryDescription',
            description:
              'The default description for a category card in the generated index about how many items this category includes',
          },
          { count: item.items.length },
        )
      }
    />
  );
}
function CardLink({ item }) {
  const doc = useDocById(item.docId);
  return (
    <CardLayout
      href={item.href}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}
export default function DocCard({ item }) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
