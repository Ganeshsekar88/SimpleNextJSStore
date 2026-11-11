import { Separator } from '@/components/ui/separator';

function SectionTitle({ text }: { text: string }) {
  return (
    <div>
      <h2 className='mb-8 break-words text-2xl font-medium tracking-wide capitalize sm:text-3xl sm:tracking-wider'>
        {text}
      </h2>
      <Separator />
    </div>
  );
}
export default SectionTitle;
