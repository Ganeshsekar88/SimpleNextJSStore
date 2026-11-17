'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '../ui/button';
import { LuShare2 } from 'react-icons/lu';

import {
  EmailShareButton,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

interface ShareButtonProps {
  productId: string;
  name: string;
  description?: string;
  // image?: string;
}

function ShareButton({
  productId,
  name,
  description,
  image,
}: ShareButtonProps) {

  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const shareLink = `${url}/products/${productId}`;

  const shareDescription =
    description ||
    `Discover ${name} and explore its features. Visit our store to learn more!`;

  const linkedInShareUrl =
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;

  const emailSubject = `Check out ${name}!`;

  const emailBody = `
Hi,

I came across this interesting product and thought you might like it!

PRODUCT: ${name}

DESCRIPTION:
${shareDescription}

EXPLORE PRODUCT:
${shareLink}

Check it out!
  `.trim();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="p-2"
          aria-label="Share product"
        >
          <LuShare2 aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="flex items-center justify-center gap-x-3 w-full"
      >

        {/* LinkedIn */}
        {/* <a
          href={linkedInShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <LinkedinIcon size={36} round />
        </a> */}

        {/* Email */}
        <EmailShareButton
          url={shareLink}
          subject={emailSubject}
          body={emailBody}
        >
          <EmailIcon size={36} round />
        </EmailShareButton>

      </PopoverContent>
    </Popover>
  );
}

export default ShareButton;