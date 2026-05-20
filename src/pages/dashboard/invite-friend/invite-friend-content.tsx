import { Check, Coins, Copy, Question, TrendUp, Wallet } from '@phosphor-icons/react'
import { useState } from 'react'

import { DashboardCard } from '../../../components/card/dashboard-card'
import { InviteReferralsTable, type InviteReferralRow } from '../../../components/table/invite-referrals-table'

type InviteFriendSummaryCard = {
  id: string
  title: string
  value: string
  icon: 'deposit' | 'referral' | 'daily'
}

type InviteFriendDataset = {
  title: string
  pointsLabel: string
  pointsValue: string
  summaries: InviteFriendSummaryCard[]
  referrerForm: {
    title: string
    description: string
    placeholder: string
    helperText: string
  }
  inviteLink: {
    title: string
    description: string
    url: string
    status: string
    actionLabel: string
  }
  inviteTable: {
    title: string
    description: string
    rows: InviteReferralRow[]
  }
}

const inviteFriendDataset: InviteFriendDataset = {
  title: 'Refer and Earn',
  pointsLabel: 'Your Points',
  pointsValue: '0 Point',
  summaries: [
    {
      id: 'deposit-points',
      title: 'Total Deposit Points',
      value: '0 Point',
      icon: 'deposit',
    },
    {
      id: 'referral-points',
      title: 'Total Referral Points',
      value: '0 Point',
      icon: 'referral',
    },
    {
      id: 'daily-points',
      title: 'Daily Points',
      value: '0/day',
      icon: 'daily',
    },
  ],
  referrerForm: {
    title: 'Add your referrer',
    description: 'Enter a valid referral code to connect your account with the correct referrer.',
    placeholder: 'Enter referral code',
    helperText: "We'll validate the code before saving it to your account.",
  },
  inviteLink: {
    title: 'Your unique invitation link to share with others',
    description: 'Share your active invite link to bring new users into your referral network.',
    url: 'https://handoff.app/invite/0x8F21A91C',
    status: 'Your code is currently active',
    actionLabel: 'Generate New Invite Link',
  },
  inviteTable: {
    title: 'Invite Friend',
    description: 'Track your invited users, current status, and points earned from each referral.',
    rows: [],
  },
}

const summaryIconByType = {
  deposit: <Wallet size={18} weight="fill" color="var(--canvas-text-primary)" />,
  referral: <Coins size={18} weight="fill" color="var(--canvas-text-primary)" />,
  daily: <TrendUp size={18} weight="fill" color="var(--canvas-text-primary)" />,
} as const

export default function InviteFriendContent() {
  const [referralCode, setReferralCode] = useState('')
  const [isInviteLinkCopied, setIsInviteLinkCopied] = useState(false)

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteFriendDataset.inviteLink.url)
      setIsInviteLinkCopied(true)
      window.setTimeout(() => {
        setIsInviteLinkCopied(false)
      }, 1200)
    } catch {
      // Ignore clipboard failures for now; UI wiring is ready for future toast/error handling.
    }
  }

  const isPointValue = (value: string) => value.toLowerCase().includes('point')
  const hasReferralCode = referralCode.trim().length > 0

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto auto minmax(0, 1fr)',
        gap: 24,
        minHeight: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 28, fontWeight: 700, lineHeight: 1.08 }}>{inviteFriendDataset.title}</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600 }}>{inviteFriendDataset.pointsLabel}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--canvas-text-tertiary)' }}>
              <Question size={14} weight="fill" />
            </span>
          </div>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{inviteFriendDataset.pointsValue}</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 18,
        }}
      >
        {inviteFriendDataset.summaries.map((summary) => (
          <DashboardCard
            key={summary.id}
            style={{
              padding: '20px 20px 18px',
              display: 'grid',
              alignContent: 'start',
              gap: 16,
              minHeight: 154,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {summaryIconByType[summary.icon]}
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{summary.title}</div>
              <div style={{ color: 'var(--canvas-text-primary)', fontSize: isPointValue(summary.value) ? 18 : 20, fontWeight: 700, lineHeight: 1.1 }}>{summary.value}</div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 18,
        }}
      >
        <DashboardCard
          style={{
            padding: '24px',
            display: 'grid',
            gap: 18,
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{inviteFriendDataset.referrerForm.title}</div>
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{inviteFriendDataset.referrerForm.description}</div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                minHeight: 46,
                padding: 6,
                borderRadius: 14,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            >
              <input
                value={referralCode}
                onChange={(event) => setReferralCode(event.target.value)}
                placeholder={inviteFriendDataset.referrerForm.placeholder}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 34,
                  padding: '0 8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'var(--canvas-font-sans)',
                }}
              />
              <button
                type="button"
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 999,
                  border: `1px solid ${hasReferralCode ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                  background: hasReferralCode ? 'var(--canvas-accent)' : 'transparent',
                  color: hasReferralCode ? '#ffffff' : 'var(--canvas-text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 10,
                  fontWeight: 600,
                  flex: 'none',
                  transition: 'background 140ms ease, color 140ms ease, border-color 140ms ease',
                }}
              >
                Send
              </button>
            </div>
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500, lineHeight: 1.5 }}>{inviteFriendDataset.referrerForm.helperText}</div>
          </div>
        </DashboardCard>

        <DashboardCard
          style={{
            padding: '24px',
            display: 'grid',
            gap: 18,
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{inviteFriendDataset.inviteLink.title}</div>
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{inviteFriendDataset.inviteLink.description}</div>
          </div>

          <button
            type="button"
            onClick={handleCopyInviteLink}
            style={{
              width: '100%',
              minHeight: 46,
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'transparent',
              color: 'var(--canvas-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              textAlign: 'left',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteFriendDataset.inviteLink.url}</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
                color: isInviteLinkCopied ? 'var(--canvas-accent)' : 'var(--canvas-text-tertiary)',
                transform: `scale(${isInviteLinkCopied ? 1.08 : 1})`,
                opacity: isInviteLinkCopied ? 1 : 0.9,
                transition: 'transform 140ms ease, color 140ms ease, opacity 140ms ease',
              }}
            >
              {isInviteLinkCopied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500, lineHeight: 1.5 }}>{inviteFriendDataset.inviteLink.status}</div>
            <button
              type="button"
              style={{
                height: 34,
                padding: '0 14px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: 'var(--canvas-text-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {inviteFriendDataset.inviteLink.actionLabel}
            </button>
          </div>
        </DashboardCard>
      </div>

      <InviteReferralsTable
        title={inviteFriendDataset.inviteTable.title}
        description={inviteFriendDataset.inviteTable.description}
        rows={inviteFriendDataset.inviteTable.rows}
        fillHeight
        style={{ alignSelf: 'stretch' }}
      />

    </div>
  )
}
