/* Central helper: the avatar image source for a user/team item.
   Authenticated delivery endpoint + ?v cache-bust so a replaced avatar
   shows immediately. Returns undefined when no avatar exists (initials
   fallback). Storage internals are never exposed to the client. */
export function avatarSrcFor(userOrItem) {
  if (!userOrItem) return undefined;
  const avatar = userOrItem.avatar;
  const id = userOrItem.id || userOrItem._id;
  if (!avatar || !avatar.hasAvatar || !id) return undefined;
  const v = avatar.updatedAt ? `?v=${encodeURIComponent(avatar.updatedAt)}` : "";
  return `/api/admin/avatar/${id}${v}`;
}
