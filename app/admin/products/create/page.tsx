import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import { createProductAction } from '@/utils/actions';
import ImageInput from '@/components/form/ImageInput';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { faker } from '@faker-js/faker';
import CheckboxInput from '@/components/form/CheckBoxInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

function CreateProduct() {
  const name = faker.commerce.productName();
  const company = faker.company.name();
  // const description = faker.commerce.productDescription();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });

  return (
    <section className='min-w-0 space-y-6 sm:space-y-8'>
      <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
            Catalog management
          </p>
          <h1 className='break-words text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl'>
            Create Product
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Add a new listing to your store catalog.
          </p>
        </div>
        <Button asChild variant='outline' className='w-fit gap-2'>
          <Link href='/admin/products'>
            <LuArrowLeft aria-hidden='true' />
            Back to products
          </Link>
        </Button>
      </header>

      <Card className='min-w-0 overflow-hidden rounded-2xl shadow-sm'>
        <div className='border-b bg-muted/30 px-5 py-4 sm:px-6'>
          <h2 className='font-semibold tracking-tight'>Product details</h2>
          <p className='text-sm text-muted-foreground'>
            Provide the product information customers will see.
          </p>
        </div>
        <div className='min-w-0 p-4 sm:p-8'>
          <FormContainer action={createProductAction}>
            <div className='grid min-w-0 gap-x-6 gap-y-5 md:grid-cols-2'>
              <FormInput
                type='text'
                name='name'
                label='product name'
                defaultValue={name}
              />
              <FormInput
                type='text'
                name='company'
                label='company'
                defaultValue={company}
              />
              <PriceInput />
              <ImageInput />
            </div>
            <div className='mt-5 min-w-0'>
              <TextAreaInput
                name='description'
                labelText='product description'
                defaultValue={description}
              />
            </div>
            <div className='mt-6 flex flex-col gap-2 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='font-medium'>Feature this product</p>
                <p className='text-sm text-muted-foreground'>
                  Featured products can appear in the storefront highlights.
                </p>
              </div>
              <div className='rounded-lg border bg-background px-3 py-2'>
                <CheckboxInput name='featured' label='Featured' />
              </div>
            </div>
            <div className='mt-8 flex justify-end border-t pt-6'>
              <SubmitButton
                text='Create Product'
                className='min-w-40 shadow-sm'
              />
            </div>
          </FormContainer>
        </div>
      </Card>
    </section>
  );
}
export default CreateProduct;
