import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));


if (typeof Element !== 'undefined') {
  Object.defineProperty(Element.prototype, 'hasPointerCapture', {
    value: () => false,
  });

  Object.defineProperty(Element.prototype, 'setPointerCapture', {
    value: () => {},
  });

  Object.defineProperty(Element.prototype, 'releasePointerCapture', {
    value: () => {},
  });

  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: () => {},
  });
}