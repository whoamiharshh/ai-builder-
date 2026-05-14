import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  TextArea,
  Badge,
  LoadingSpinner,
  SkeletonLoader,
  Modal,
  ProgressBar,
} from './ui';

export function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Component Library</h1>
          <p className="text-lg text-slate-300">
            A collection of reusable, accessible UI components
          </p>
        </div>

        {/* Button Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Buttons</h2>
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm text-slate-300">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-slate-300">Sizes</p>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-slate-300">States</p>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="text-lg font-semibold text-white">Premium Card</h3>
              <p className="mt-2 text-slate-300">
                This is a standard card component with rounded corners and backdrop blur.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-white">Nested Card</h3>
              <p className="mt-2 text-slate-300">
                Cards can be nested and customized with className prop.
              </p>
            </Card>
          </div>
        </Card>

        {/* Input Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Inputs</h2>
          <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="your@email.com" />
            <TextArea label="Message" placeholder="Type your message here..." />
            <Input label="Search" type="text" placeholder="Search..." />
          </div>
        </Card>

        {/* Badges Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Badges</h2>
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm text-slate-300">Tag Variant</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="tag">New</Badge>
                <Badge variant="tag">Featured</Badge>
                <Badge variant="tag">Popular</Badge>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-slate-300">Status Variant</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="status" status="success">
                  Active
                </Badge>
                <Badge variant="status" status="warning">
                  Pending
                </Badge>
                <Badge variant="status" status="error">
                  Failed
                </Badge>
                <Badge variant="status" status="info">
                  Processing
                </Badge>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-slate-300">Score Variant</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="score">8.5/10</Badge>
                <Badge variant="score">9.2/10</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Progress</h2>
          <div className="space-y-6">
            <ProgressBar value={30} label="30% Complete" />
            <ProgressBar value={60} label="60% Complete" />
            <ProgressBar value={90} label="90% Complete" />
          </div>
        </Card>

        {/* Loading Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Loading States</h2>
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-sm text-slate-300">Spinner Sizes</p>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <LoadingSpinner size="sm" />
                  <p className="mt-2 text-xs text-slate-400">Small</p>
                </div>
                <div className="flex flex-col items-center">
                  <LoadingSpinner size="md" />
                  <p className="mt-2 text-xs text-slate-400">Medium</p>
                </div>
                <div className="flex flex-col items-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-2 text-xs text-slate-400">Large</p>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-4 text-sm text-slate-300">With Label</p>
              <LoadingSpinner label="Generating..." />
            </div>
            <div>
              <p className="mb-4 text-sm text-slate-300">Skeleton Loader</p>
              <SkeletonLoader count={2} className="h-12 w-full" />
            </div>
          </div>
        </Card>

        {/* Modal Section */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Modal</h2>
          <p className="mb-4 text-slate-300">Click the button to open a modal:</p>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <p className="text-slate-300">
              This is an example modal component. You can customize the size, title, and content.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </Card>

        {/* Documentation */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-white">Documentation</h2>
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-semibold text-white">Import Components</h3>
              <code className="mt-2 block rounded bg-slate-900/50 p-3 text-sm">
                {`import { Button, Card, Input, Badge, ... } from '@/components/ui'`}
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-white">Features</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Fully TypeScript typed</li>
                <li>Accessible (WCAG 2.1 AA)</li>
                <li>Responsive design</li>
                <li>Motion animations</li>
                <li>80%+ test coverage</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
