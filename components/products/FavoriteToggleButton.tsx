import { auth } from '@clerk/nextjs/server';
import { CardSignInButton } from '../form/Buttons';
import { fetchFavoriteId } from '@/utils/actions';
import FavoriteToggleForm from './FavoriteToggleForm';
async function FavoriteToggleButton({
  productId,
  signInRedirectUrl,
  userId,
  favoriteId,
}: {
  productId: string;
  signInRedirectUrl?: string;
  userId?: string | null;
  favoriteId?: string | null;
}) {
  const resolvedUserId = userId === undefined ? (await auth()).userId : userId;
  if (!resolvedUserId) {
    return <CardSignInButton redirectUrl={signInRedirectUrl} />;
  }
  const resolvedFavoriteId = favoriteId === undefined
    ? await fetchFavoriteId({ productId })
    : favoriteId;

  return (
    <FavoriteToggleForm
      favoriteId={resolvedFavoriteId}
      productId={productId}
    />
  );
}
export default FavoriteToggleButton;
