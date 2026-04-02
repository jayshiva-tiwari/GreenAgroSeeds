import { createNavigation } from 'next-intl/navigation';
import { routing } from './i18n/routing';

export const locales = routing.locales;

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

