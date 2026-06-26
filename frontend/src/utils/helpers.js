import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateFull = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'ADMIN': return 'badge-purple';
    case 'STORE_OWNER': return 'badge-blue';
    default: return 'badge-green';
  }
};

export const getRoleLabel = (role) => {
  switch (role) {
    case 'ADMIN': return 'Admin';
    case 'STORE_OWNER': return 'Store Owner';
    default: return 'User';
  }
};

export const downloadCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const truncate = (str, n = 40) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '...' : str;
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const ROLES = {
  ADMIN: 'ADMIN',
  STORE_OWNER: 'STORE_OWNER',
  USER: 'USER',
};
