'use client';

import React from 'react';
import { VoiceParseResult } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Check, Edit2, Volume2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VoiceTranscriptProps {
  transcript: string;
  interimTranscript?: string;
  parsedResult: VoiceParseResult | null;
  onEdit?: () => void;
  onConfirm?: () => void;
  className?: string;
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  transcript,
  interimTranscript,
  parsedResult,
  onEdit,
  onConfirm,
  className,
}) => {
  if (!transcript && !interimTranscript && !parsedResult) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground bg-muted/20">
        <Volume2 className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">Say something like:</p>
        <p className="text-xs italic mt-1 text-foreground/80">
          &ldquo;शर्मा जी ने पाँच हज़ार रुपये दिए&rdquo; or &ldquo;Ramesh uncle gave 10,000 rupees&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        {/* Spoken text live transcript */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Transcribed Speech (सुनी गई आवाज़)
          </p>
          <p className="text-sm">
            <span className="font-medium text-foreground">{transcript}</span>
            {interimTranscript && (
              <span className="text-muted-foreground italic ml-1">
                {interimTranscript}...
              </span>
            )}
          </p>
        </div>

        {/* Parsed structured cards preview */}
        {parsedResult && (
          <div className="space-y-3 rounded-lg border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                Parsed Information (पहचाना गया विवरण)
              </span>
              <Badge
                variant={
                  parsedResult.confidence > 0.8
                    ? 'success'
                    : parsedResult.confidence > 0.5
                    ? 'warning'
                    : 'secondary'
                }
                className="text-[10px]"
              >
                {Math.round(parsedResult.confidence * 100)}% Match
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Guest Name (नाम)
                </span>
                <span className="text-sm font-bold text-foreground">
                  {parsedResult.guestName || 'Not detected'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Gift Type (प्रकार)
                </span>
                <span className="text-sm font-bold capitalize text-foreground">
                  {parsedResult.giftType.toLowerCase().replace('_', ' ')}
                </span>
              </div>

              {parsedResult.cashAmount && (
                <div className="col-span-2">
                  <span className="text-[11px] text-muted-foreground block">
                    Cash Amount (राशि)
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(parsedResult.cashAmount)}
                  </span>
                </div>
              )}

              {parsedResult.giftDescription && (
                <div className="col-span-2">
                  <span className="text-[11px] text-muted-foreground block">
                    Item Description (वस्तु)
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {parsedResult.giftDescription}
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Confirm or Edit */}
            <div className="flex items-center gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
              {onConfirm && (
                <Button
                  type="button"
                  size="sm"
                  onClick={onConfirm}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Use This Data</span>
                </Button>
              )}
              {onEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="gap-1.5"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
