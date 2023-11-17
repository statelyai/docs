import { MenuIcon, XIcon } from 'lucide-react';
import React, { Fragment, ReactNode } from 'react';
import { ButtonLink } from './SharedComponents';
const { Disclosure, Menu, Transition } = require('@headlessui/react');

const navigation = [
  { name: 'Docs', href: '/docs', current: false },
  { name: 'Blog', href: '/blog', current: false },
  { name: 'Pricing', href: '/pricing', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Navbar() {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center p-2 rounded-full text-white/60 hover:text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0">
                  <a href="/">
                    <img
                      className="w-auto h-8"
                      src="/assets/landing/stately-logo.svg"
                      height="32"
                      width="115"
                      alt="Stately"
                    />
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block md:flex">
                  <div className="flex space-x-1">
                    <FeaturesMenu />

                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        isCurrent={item.current}
                        href={item.href}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                  <div className="hidden ml-8 lg:flex">
                    <a
                      href="https://discord.gg/xstate"
                      className={classNames(
                        linkStyles,
                        'self-center opacity-60 hover:opacity-100 cursor-pointer',
                      )}
                      target="_blank"
                    >
                      <img
                        alt="Discord"
                        src="/assets/landing/discord-mark-white.svg"
                        className="w-[18px] h-[18px]"
                      />
                    </a>
                    <a
                      href="https://twitter.com/statelyai"
                      className={classNames(
                        linkStyles,
                        'self-center opacity-60 hover:opacity-100 cursor-pointer',
                      )}
                      target="_blank"
                    >
                      <img
                        alt="Twitter"
                        src="/assets/landing/twitter-white.svg"
                        className="w-[18px] h-[18px]"
                      />
                    </a>
                    <a
                      href="https://youtube.com/c/statelyai"
                      className={classNames(
                        linkStyles,
                        'self-center opacity-60 hover:opacity-100 cursor-pointer',
                      )}
                      target="_blank"
                    >
                      <img
                        alt="YouTube"
                        src="/assets/landing/youtube-white.svg"
                        className="w-[18px] h-[18px]"
                      />
                    </a>
                    <a
                      href="https://github.com/statelyai/xstate"
                      className={classNames(
                        linkStyles,
                        'self-center opacity-60 hover:opacity-100 cursor-pointer',
                      )}
                      target="_blank"
                    >
                      <img
                        alt="GitHub"
                        src="/assets/landing/github-white.svg"
                        className="w-[18px] h-[18px]"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <NavLink href="/registry/login">Log in</NavLink>

                  <ButtonLink
                    size="small"
                    background="blue"
                    href="/registry/signup"
                    target="_self"
                  >
                    Sign up
                  </ButtonLink>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="rounded-md shadow-lg sm:hidden bg-blue-850">
              <div className="px-2 py-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      linkStyles,
                      'block text-white/60  hover:text-white hover:bg-white/10 rounded-md',
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Disclosure.Button
                  key="log-in"
                  as="a"
                  href="/"
                  className={classNames(
                    linkStyles,
                    'block text-white/60  hover:text-white hover:bg-white/10 rounded-md',
                  )}
                  aria-label="Log in"
                >
                  Log in
                </Disclosure.Button>
                <Disclosure.Button
                  key="sign-up"
                  as="a"
                  href="/"
                  className={classNames(
                    linkStyles,
                    'block text-white/60  hover:text-white hover:bg-white/10 rounded-md',
                  )}
                  aria-label="Sign up"
                >
                  Sign up
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </div>
        </>
      )}
    </Disclosure>
  );
}

function FeaturesMenu() {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button
          className={classNames(
            'relative flex text-sm text-white/60 hover:text-white',
            linkStyles,
          )}
        >
          Features
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-70 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-1 w-fit origin-top-right rounded-md bg-blue-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[0.5px] border-white/20">
          <NavMenuItem href="#design">Design</NavMenuItem>
          <NavMenuItem href="#build">Build</NavMenuItem>
          <NavMenuItem href="#deploy">Deploy</NavMenuItem>
          <NavMenuItem href="#understand">Understand</NavMenuItem>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

const linkStyles =
  'rounded-full px-3 py-2 text-sm font-medium hover:no-underline font-semibold focus:outline-none focus:ring-1 focus:ring-blue-300 focus:ring-offset-1 focus:ring-offset-gray-800';

function NavLink({
  children,
  isCurrent,
  href,
  target,
}: {
  children: ReactNode;
  isCurrent?: boolean;
  href: string;
  target?: '_blank' | '_self';
}) {
  return (
    <a
      href={href}
      className={classNames(
        isCurrent
          ? 'bg-gray-900 text-white'
          : 'text-white/60  hover:text-white',
        linkStyles,
      )}
      aria-current={isCurrent ? 'page' : undefined}
      target={target}
    >
      {children}
    </a>
  );
}

function NavMenuItem({ children, href }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={href}
          className={classNames(
            active ? 'bg-white/10 text-white' : '',
            'block mx-1 px-4 py-2 rounded-md text-sm text-white/90 hover:text-white hover:no-underline font-semibold',
          )}
        >
          {children}
        </a>
      )}
    </Menu.Item>
  );
}

// TODO: use Docusaurus links
{
  /* <Link
className="px-4 py-2 text-gray-500 bg-white rounded-full"
to="/docs"
> */
}
