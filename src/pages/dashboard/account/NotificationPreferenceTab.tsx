import { FiBell } from "react-icons/fi";

import { Card, Toggle } from "../../../components/ui";

/**
 * "Notification Preference".
 *
 * `My Account-2.png` draws per-type toggles. **The Member model has no preferences field
 * and there is no endpoint to save one** — `PUT /api/members/profile` accepts name, phone,
 * jobTitle, bio, socials and an image, nothing else. Wiring live toggles here would give
 * the member a switch that flips, appears to save, and silently does nothing after a
 * reload.
 *
 * So the toggles render in their real state — on, because every member currently receives
 * every notification — and are disabled with the reason stated. See REDESIGN.md §5.
 */
const CHANNELS = [
  { key: "events", label: "Events", hint: "New events, and reminders for ones you registered for." },
  { key: "meetings", label: "Meetings", hint: "Meetings scheduled for you, and reminders you set." },
  { key: "dues", label: "Dues", hint: "New dues, deadlines, and payment confirmations." },
  { key: "elections", label: "Elections", hint: "Voting windows opening and results." },
  { key: "news", label: "News & Publications", hint: "Anything your association publishes." },
];

const NotificationPreferenceTab = () => (
  <div className="max-w-2xl">
    <Card accent className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <span className="w-11 h-11 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
          <FiBell className="w-5 h-5 text-org-primary" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold text-ink">Notification Preference</h3>
          <p className="text-sm text-muted mt-1">You currently receive every notification your association sends. Choosing which ones to receive isn&rsquo;t available yet — these are shown so you know what you&rsquo;re subscribed to.</p>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-hairline">
        {CHANNELS.map(channel => (
          <li key={channel.key}>
            {/* Toggle renders its own label/description block. */}
            <Toggle checked disabled label={channel.label} description={channel.hint} />
          </li>
        ))}
      </ul>
    </Card>
  </div>
);

export default NotificationPreferenceTab;
