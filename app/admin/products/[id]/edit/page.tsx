import { SubmitButton } from '@/components/form/Buttons';
import CheckboxInput from '@/components/form/CheckBoxInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  fetchAdminProductDetails,
  updateProductAction,
  updateProductImageAction,
} from '@/utils/actions';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchAdminProductDetails(id);
  const { name, company, description, featured, price } = product;

  return (
    <section className='space-y-8'>
      <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
            Catalog management
          </p>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            Edit Product
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Update the listing details and storefront image for {name}.
          </p>
        </div>
        <Button asChild variant='outline' className='w-fit gap-2'>
          <Link href='/admin/products'>
            <LuArrowLeft aria-hidden='true' />
            Back to products
          </Link>
        </Button>
      </header>

      <div className='grid gap-6 xl:grid-cols-3'>
        <Card className='h-fit overflow-hidden rounded-2xl shadow-sm'>
          <div className='border-b bg-muted/30 px-5 py-4 sm:px-6'>
            <h2 className='font-semibold tracking-tight'>Product image</h2>
            <p className='text-sm text-muted-foreground'>
              Preview or replace the current image.
            </p>
          </div>
          <div className='p-5 sm:p-6'>
            <ImageInputContainer
              action={updateProductImageAction}
              name={name}
              image={product.image}
              text='Update image'
            >
              <input type='hidden' name='id' value={id} />
              <input type='hidden' name='url' value={product.image} />
            </ImageInputContainer>
          </div>
        </Card>

        <Card className='overflow-hidden rounded-2xl shadow-sm xl:col-span-2'>
          <div className='border-b bg-muted/30 px-5 py-4 sm:px-6'>
            <h2 className='font-semibold tracking-tight'>Product details</h2>
            <p className='text-sm text-muted-foreground'>
              Keep the product information accurate for customers.
            </p>
          </div>
          <div className='p-5 sm:p-8'>
            <FormContainer action={updateProductAction}>
              <input type='hidden' name='id' value={id} />
              <div className='grid gap-x-6 gap-y-5 md:grid-cols-2'>
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
                <PriceInput defaultValue={price} />
              </div>
              <div className='mt-5'>
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
                  <CheckboxInput
                    name='featured'
                    label='Featured'
                    defaultChecked={featured}
                  />
                </div>
              </div>
              <div className='mt-8 flex justify-end border-t pt-6'>
                <SubmitButton
                  text='Update Product'
                  className='min-w-40 shadow-sm'
                />
              </div>
            </FormContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default EditProductPage;
