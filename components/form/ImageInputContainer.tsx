'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import FormContainer from './FormContainer';
import ImageInput from './ImageInput';
import { SubmitButton } from './Buttons';
import { type actionFunction } from '@/utils/types';

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};

function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, text } = props;
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);

  return (
    <div className='space-y-4'>
      <Image
        src={image}
        width={200}
        height={200}
        className='h-[200px] w-[200px] rounded-xl border bg-muted object-cover shadow-sm'
        alt={name}
      />

      <Button
        type='button'
        variant='outline'
        size='sm'
        className='gap-2'
        onClick={() => setUpdateFormVisible((prev) => !prev)}
      >
        {isUpdateFormVisible ? 'Cancel image update' : text}
      </Button>
      {isUpdateFormVisible && (
        <div className='max-w-md rounded-xl border bg-muted/20 p-4'>
          <FormContainer action={action}>
            {props.children}
            <ImageInput />
            <SubmitButton size='sm' />
          </FormContainer>
        </div>
      )}
    </div>
  );
}
export default ImageInputContainer;
