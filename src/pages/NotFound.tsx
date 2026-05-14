import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function NotFound() {
  return (
    <main className="px-6 pb-16 pt-12 sm:px-10 lg:px-12">
      <section className="mx-auto max-w-3xl">
        <Card className="text-center py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Page not found</p>
          <h1 className="mt-6 text-5xl font-semibold text-white">404</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">The page you’re looking for doesn’t exist yet. Return to the studio and keep building your launch workflow.</p>
          <div className="mt-10 flex justify-center">
            <Link to="/">
              <Button variant="primary" size="lg">Go back home</Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
