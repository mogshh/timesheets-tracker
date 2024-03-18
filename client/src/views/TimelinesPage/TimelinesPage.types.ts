import { SpectrumColumnProps } from '@adobe/react-spectrum';
import { TimelineEvent } from '../../components/Timeline/Timeline.types';

export type EventColumn = SpectrumColumnProps<TimelineEvent> & { name: string; key: string };
