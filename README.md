# Yardly

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Commitlint](https://img.shields.io/badge/Commitlint-000000?style=for-the-badge&logo=commitlint&logoColor=white)
![Husky](https://img.shields.io/badge/Husky-000000?style=for-the-badge&logo=husky&logoColor=white)

**Book seasonal home services from local providers. Snow, lawn, hedges, pool — tracked, priced, and invoiced in one app.**

Yardly is a mobile-first marketplace that connects homeowners with local providers for seasonal outdoor maintenance. From snow removal in winter to pool cleaning in summer, users can browse services, book visits, track their seasonal usage caps, and manage every invoice in one place.

## Features

- **Seasonal onboarding** — a full-screen carousel that explains the services available each season.
- **Address verification** — autocomplete with OpenStreetMap, plus a "use my location" button powered by `expo-location`.
- **Authentication** — email/password sign-up, sign-in, password reset, and email confirmation via Supabase Auth.
- **User profiles** — name, address, and coordinates stored in a `profiles` table with row-level security.
- **Protected routes** — tab navigation and admin screens are guarded by authentication state.
- **Legal pages** — Terms of Service and Privacy Policy, accessible as native modals on mobile and pages on web.
- **Seasonal 404** — a not-found screen that adapts its background image and message to the current season.

## Tech Stack

| Technology       | Role                                           |
| ---------------- | ---------------------------------------------- |
| **Expo**         | Framework and build tooling for React Native   |
| **React Native** | Cross-platform mobile UI                       |
| **TypeScript**   | Type-safe JavaScript                           |
| **Supabase**     | Authentication and Postgres database           |
| **Expo Router**  | File-based navigation                          |
| **HTML / CSS**   | Web target and styling primitives              |
| **pnpm**         | Fast, disk-efficient package manager           |
| **ESLint**       | Static analysis and code quality               |
| **Prettier**     | Opinionated code formatting                    |
| **Commitlint**   | Conventional commit message validation         |
| **Husky**        | Git hooks for pre-commit and commit-msg checks |
| **lint-staged**  | Run linters only on staged files               |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- An Expo account (for EAS builds)
- A Supabase project

### Installation

```bash
# Clone the repository
git clone https://github.com/Chelny/yardly.git
cd yardly

# Install dependencies
pnpm install

# Copy the environment template
cp .env.example .env
```

### Environment Variables

Fill in your Supabase credentials in .env:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

Run the following in your Supabase SQL Editor to create the profiles table and the trigger that creates a profile after sign-up:

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  address_line text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, address_line, latitude, longitude)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'address_line',
    (new.raw_user_meta_data ->> 'latitude')::double precision,
    (new.raw_user_meta_data ->> 'longitude')::double precision
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Run the App

```bash
# Start the development server
pnpm dev

# Or run on a specific platform
pnpm ios
pnpm android
pnpm web
```

### Project Structure

```bash
src/
├── app/                  # Expo Router routes
│   ├── (auth)/           # Sign-in, sign-up, password reset
│   ├── (tabs)/           # Protected dashboard, services, booking, invoices
│   ├── _layout.tsx       # Root layout with auth provider
│   ├── +not-found.tsx    # 404 screen
│   ├── index.tsx         # Onboarding screen
│   ├── privacy.tsx       # Privacy Policy
│   └── terms.tsx         # Terms of Service
├── components/
│   ├── ui/               # Button, Input, Checkbox, Select, etc.
│   └── themed-text.tsx   # Typography system
├── constants/            # Theme tokens (colors, spacing, typography)
├── hooks/                # useTheme, useColorScheme
└── lib/                  # Supabase client and utilities
```

### Commit Convention

This project follows Conventional Commits. Commit messages are validated by Commitlint on every commit via Husky.

```bash
# Examples
feat(auth): add password reset flow
fix(ui): correct input border color on focus
docs: update README with setup instructions
```

### License

This project is for portfolio purposes. See LICENSE for details.
