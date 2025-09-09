'use server';

/**
 * @fileOverview A flow to filter timeline items by keywords using an LLM.
 *
 * - filterTimelineItems - A function that filters timeline items based on keywords.
 * - FilterTimelineItemsInput - The input type for the filterTimelineItems function.
 * - FilterTimelineItemsOutput - The return type for the filterTimelineItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Import the TimelineItem type
import {TimelineItem} from '@/lib/types';

const FilterTimelineItemsInputSchema = z.object({
  keywords: z.string().describe('The keywords to filter timeline items by.'),
  timelineItems: z.array(z.any()).describe('The timeline items to filter.'),
});

export type FilterTimelineItemsInput = z.infer<typeof FilterTimelineItemsInputSchema>;

const FilterTimelineItemsOutputSchema = z.array(z.any()).describe('The filtered timeline items.');

export type FilterTimelineItemsOutput = z.infer<typeof FilterTimelineItemsOutputSchema>;

export async function filterTimelineItems(input: FilterTimelineItemsInput): Promise<FilterTimelineItemsOutput> {
  return filterTimelineItemsFlow(input);
}

const filterTimelineItemsPrompt = ai.definePrompt({
  name: 'filterTimelineItemsPrompt',
  input: {schema: FilterTimelineItemsInputSchema},
  output: {schema: FilterTimelineItemsOutputSchema},
  prompt: `You are an expert at filtering timeline items based on keywords.

You will receive a list of timeline items and a set of keywords.

Your job is to return a new list containing only the timeline items that are relevant to the keywords.

Timeline Items: {{{timelineItems}}}

Keywords: {{{keywords}}}

Only return timeline items that are related to the keywords.
`,
});

const filterTimelineItemsFlow = ai.defineFlow(
  {
    name: 'filterTimelineItemsFlow',
    inputSchema: FilterTimelineItemsInputSchema,
    outputSchema: FilterTimelineItemsOutputSchema,
  },
  async input => {
    const {output} = await filterTimelineItemsPrompt(input);
    return output!;
  }
);
