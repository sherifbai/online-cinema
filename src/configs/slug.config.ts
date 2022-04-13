import slugify from 'slugify';

export const genSlug = async (text: string): Promise<string> => {
  return slugify(text, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    trim: true,
  });
}
