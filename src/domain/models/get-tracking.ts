export type GraphQlGetTracking = {
    data: {
        result: ResponseGetTracking;
    };
};

export type ResponseGetTracking = {
    lastStatus: string;
    trackingEvents: TrackingEventsParams[];
};

export type TrackingEventsParams = {
    trackingCode: string;
    createdAt: string;
    originalTitle: string;
    to: string;
    from: string;
};