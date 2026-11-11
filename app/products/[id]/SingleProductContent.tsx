





import { auth } from '@clerk/nextjs/server';

import BreadCrumbs from '@/components/single-product/BreadCrumbs';
import {
    fetchSingleProduct,
    findExistingReview,
} from '@/utils/actions';

import Image from 'next/image';
import { formatCurrency } from '@/utils/format';

import FavoriteToggleButton from '@/components/products/FavoriteToggleButton';
import AddToCart from '@/components/single-product/AddToCart';
import ProductRating from '@/components/single-product/ProductRating';
import ShareButton from '@/components/single-product/ShareButton';

import SubmitReview from '@/components/reviews/SubmitReview';
import ProductReviews from '@/components/reviews/ProductReview';
import { connection } from 'next/server';


async function SingleProductContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    await connection();
    const { id } = await params;

    const { userId } = await auth();

    const product = await fetchSingleProduct(id);

    const reviewDoesNotExist =
        userId && !(await findExistingReview(userId, product.id));

    const {
        name,
        image,
        company,
        description,
        price,
    } = product;

    const dollarsAmount = formatCurrency(price);

    return (
        <section>

            <BreadCrumbs name={name} />

            <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">

                <div className="relative h-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
                        priority
                        className="w-full rounded-md object-cover"
                    />
                </div>

                <div>

                    <div className="flex gap-x-8 items-center">

                        <h1 className="capitalize text-3xl font-bold">
                            {name}
                        </h1>

                        <FavoriteToggleButton
                            productId={product.id}
                            signInRedirectUrl={`/products/${id}`}
                        />

                        <ShareButton
                            productId={id}
                            name={name}
                        />

                    </div>

                    <ProductRating productId={id} />

                    <h4 className="text-xl mt-2">
                        {company}
                    </h4>

                    <p className="mt-3 text-md bg-muted inline-block p-2 rounded-md">
                        {dollarsAmount}
                    </p>

                    <p className="mt-6 leading-8 text-muted-foreground">
                        {description}
                    </p>

                    <AddToCart productId={id} />

                </div>

            </div>

            <ProductReviews productId={id} />

            {reviewDoesNotExist && (
                <SubmitReview productId={id} />
            )}

        </section>
    );
}

export default SingleProductContent;


