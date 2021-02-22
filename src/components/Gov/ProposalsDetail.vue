<template>
  <div class="proposals_detail_wrap">
    <div class="proposals_detail_content">
      <div class="proposals_detail_title_container">
        <span>{{ $t('ExplorerLang.gov.proposalDetails') }} | </span>
        <span>{{ title }}</span>
      </div>

      <div class="proposals_detail_information">
        <div class="level_container">
          <div class="proposals_detail_type">
            <span>{{ type }}</span>
          </div>
          <div class="step_content">
            <i v-if="status === proposalStatus.passed" style="color:#44C190;" class="iconfont iconPass"></i>
            <i v-if="status === proposalStatus.rejected" style="color:rgb(254, 138, 138);" class="iconfont iconVeto"></i>
            <i v-if="status === proposalStatus.votingPeriod" style="color: var(--bgColor)" class="iconfont iconDepositPeriod"></i>
            <i v-if="status === proposalStatus.depositPeriod" style="color: var(--bgColor)" class="iconfont iconDepositPeriod-liebiao"></i>
            <span>{{ status }}</span>
          </div>
          <div class="time_content">
            <span v-if="status === proposalStatus.votingPeriod && flShowVotingHourLeft"> <i style="color:#5AC8FA;" class="iconfont iconHoursLeft"></i>{{ votingHourLeft }} Left </span>
            <span v-if="status === proposalStatus.depositPeriod && flShowDepositHourLeft"> <i style="color:#5AC8FA;" class="iconfont iconHoursLeft"></i>{{ depositHourLeft }} Left </span>
          </div>
        </div>
        <div class="proposals_detail_information_wrap">
          <div class="information_props_wrap">
            <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.proposer') }} :</span>
            <span v-show="proposer !== '--'" class="information_value information_show_trim">
              <span style="font-family:Arial" class="address_link jump_route" @click="addressRoute(proposer)">
                {{ proposer }}
              </span>
            </span>
            <span v-show="proposer == '--'" class="information_value information_show_trim ">{{ proposer }}</span>
          </div>
          <div class="information_props_wrap">
            <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.submitHash') }} :</span>
            <span v-show="submitHash !== '--'" class="information_value information_show_trim">
              <router-link class="jump_route" :to="`/tx?txHash=${submitHash}`">{{ submitHash }}</router-link>
            </span>
            <span v-show="submitHash == '--'" class="information_value information_show_trim ">{{ submitHash }}</span>
          </div>
          <div class="information_props_wrap">
            <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.type') }} :</span>
            <span class="information_value">{{ type }}</span>
          </div>
          <div v-show="type === proposalType.CommunityPoolSpendProposal">
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.recipient') }} :</span>
              <template>
                <span v-if="recipient" class="information_value information_show_trim">
                  <router-link class="jump_route" :to="`/address/${recipient}`">{{ recipient }}</router-link>
                </span>
               <span v-else class="information_value information_show_trim ">--</span>
              </template>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.amount') }} :</span>
              <span class="information_value">{{ amount }}</span>
            </div>
          </div>
          <div class="information_props_wrap">
            <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.description') }} :</span>
            <span class="information_value">
              <!-- <pre class="information_pre information_show_trim" v-html="description"></pre> -->
              {{description}}
            </span>
          </div>
          <div v-show="type === proposalType.SoftwareUpgradeProposal">
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.name') }} :</span>
              <span class="information_value information_show_trim">
                <span class="information_pre">{{ name }}</span>
              </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.switchHeight') }} :</span>
              <span class="information_value information_show_trim">
                <span class="information_pre">{{ height }}</span>
              </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.info') }} :</span>
              <span class="information_value information_show_trim">
                <span class="information_pre">{{ info }}</span>
              </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.time') }} :</span>
              <span class="information_value information_show_trim">
                <span class="information_pre">{{ time }}</span>
              </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.upgradedClientState') }} :</span>
              <span class="information_value information_show_trim">
                <span class="information_pre">{{ upgradedClientState }}</span>
              </span>
            </div>
          </div>
          <div class="parameter_container" v-show="type === proposalType.ParameterChangeProposal">
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.parameterDetails') }} :</span>
              <span v-html="parameterValue"></span>
            </div>
          </div>
        </div>
        <div class="proposal_detail_content">
          <div class="proposals_detail_information_wrap">
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.submitTime') }} :</span>
              <span class="information_value">{{ submitAge }} <span v-show="submitAge">(</span>{{ submitTime }}<span v-show="submitAge">)</span></span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.depositEndTime') }} :</span>
              <span class="information_value"
                >{{ depositEndAge }}
                <span v-show="flShowDepositHourLeft">{{ depositHourLeft }} left </span>
                <span v-show="depositEndAge || flShowDepositHourLeft">(</span>{{ depositEndTime }}<span v-show="depositEndAge || flShowDepositHourLeft">)</span>
              </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.totalDeposit') }} :</span>
              <span class="information_value">
                {{ totalDeposit }}
                <span v-show="burnValue">({{ burnValue }}% {{ $t('ExplorerLang.gov.proposalDetail.burned') }})</span>
              </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.votingStartTime') }} :</span>
              <span class="information_value">{{ votingStartAge }} <span v-show="votingStartAge">(</span>{{ votingStartTime }}<span v-show="votingStartAge">)</span> </span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.votingEndTime') }} :</span>
              <span class="information_value"
                >{{ votingEndAge }}
                <span v-show="flShowVotingHourLeft">{{ votingHourLeft }} left </span>
                <span v-show="votingEndAge || flShowVotingHourLeft">(</span>{{ votingEndTime }}<span v-show="votingEndAge || flShowVotingHourLeft">)</span>
              </span>
            </div>
          </div>
          <div class="proposals_detail_information_wrap">
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.status') }} :</span>
              <span class="information_value">{{ status }}</span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.participation') }} :</span>
              <span class="information_value">{{ currentParticipationValue }} (Threshold {{ participationValue }})</span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.yes') }} :</span>
              <span class="information_value">{{ currentYesValue }} (Threshold {{ yesThresholdValue }})</span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.no') }} :</span>
              <span class="information_value">{{ currentNoValue }}</span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.noWithVeto') }} :</span>
              <span class="information_value">{{ currentNoWithVetoValue }} (Threshold {{ vetoThresholdValue }})</span>
            </div>
            <div class="information_props_wrap">
              <span class="information_props">{{ $t('ExplorerLang.gov.proposalDetail.abstain') }} :</span>
              <span class="information_value">{{ currentAbstainValue }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card_container">
        <div v-show="depositorObj" class="deposit_card_content_wrap">
          <keep-alive>
            <m-deposit-card :depositObj="depositorObj" :burnPercent="burnPercent" :status="status"></m-deposit-card>
          </keep-alive>
        </div>
        <div v-show="votingObj" class="voting_mobile_content">
          <div v-show="votingObj" class="voting_proposal_card_content">
            <keep-alive>
              <m-voting-card :votingBarObj="votingObj"></m-voting-card>
            </keep-alive>
          </div>
        </div>
      </div>

      <div class="proposal_table">
        <div class="proposal_table_title">
          <div class="proposals_table_title_div" style="margin-top: 0;">Voters</div>
          <ul class="filter_content">
            <li class="tab_option" v-for="(item, index) in filterTabArr" :key="index" :class="item.isActive ? 'blue_style' : ''" @click="filterVoteTx(item.key, index)">
              <span>{{ item.label }} {{ item.value }}</span> <span>|</span>
            </li>
          </ul>
          <div class="voting_options">
            <span class="first">
              <i class="yes_option_style"></i>{{ $t('ExplorerLang.gov.proposalDetail.yes') }}: <span>{{ voteDetailsYes }}</span> </span
            >|
            <span>
              <i class="no_option_style"></i>{{ $t('ExplorerLang.gov.proposalDetail.no') }}: <span>{{ voteDetailsNo }}</span> </span
            >|
            <span>
              <i class="no_with_veto_option_style"></i>{{ $t('ExplorerLang.gov.proposalDetail.noWithVeto') }}: <span>{{ voteDetailsNoWithVeto }} </span> </span
            >|
            <span>
              <i class="abstain_option_style"></i>{{ $t('ExplorerLang.gov.proposalDetail.abstain') }}:<span>{{ voteDetailsAbstain }}</span>
            </span>
          </div>
        </div>
        <div class="proposals_detail_table_wrap">
          <el-table class="proposals_voter_table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="voterData">
            <el-table-column prop="voter" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.voter')">
              <template v-slot:default="{ row }">
                <el-tooltip v-if="row.isValidator" :content="row.address" placement="top">
                  <router-link :to="`/staking/${row.address}`">{{ formatMoniker(row.moniker, monikerNum.otherTable) || formatAddress(row.address) }}</router-link>
                </el-tooltip>
                <el-tooltip v-else :content="row.voter" placement="top">
                  <router-link :to="`/address/${row.voter}`">{{ formatAddress(row.voter) }}</router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="option" :min-width="ColumnMinWidth.voteOption" :label="$t('ExplorerLang.table.voteOption')"></el-table-column>
            <el-table-column prop="block" :min-width="ColumnMinWidth.blockListHeight" :label="$t('ExplorerLang.table.block')">
              <template v-slot:default="{ row }">
                <router-link :to="`/block/${row.block}`">{{ row.block }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="hash" :width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
              <template v-slot:default="{ row }">
                <el-tooltip :content="row.hash" placement="top" :disabled="!isValid(row.hash)">
                  <router-link :to="`/tx?txHash=${row.hash}`">{{ formatTxHash(row.hash) }}</router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="time" align="right" :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.time')"></el-table-column>
          </el-table>
        </div>
        <div class="table_pagination">
          <keep-alive>
            <m-pagination :pageSize="pageSize" :total="voterCount" :page="currentVoterPageNum" :page-change="pageChangeVoter"></m-pagination>
          </keep-alive>
        </div>
      </div>

      <!-- <div class="proposal_table" v-if="depositorData.length !== 0"> -->
      <div class="proposal_table">
        <div class="proposals_table_title_div" style="margin-top: 0;">Depositors</div>
        <div class="proposals_detail_table_wrap">
          <el-table class="proposals_voter_table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="depositorData">
            <el-table-column prop="depositor" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.voter')">
              <template v-slot:default="{ row }">
                <el-tooltip :content="row.depositor" placement="top" :disabled="isValid(row.moniker)">
                  <router-link :to="`/address/${row.depositor}`">{{ formatMoniker(row.moniker, monikerNum.otherTable) || formatAddress(row.depositor) }}</router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="amount" :min-width="ColumnMinWidth.amount" :label="$t('ExplorerLang.table.amount')"></el-table-column>
            <el-table-column prop="type" :min-width="ColumnMinWidth.proposalType" :label="$t('ExplorerLang.table.type')"></el-table-column>
            <el-table-column prop="hash" :width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
              <template v-slot:default="{ row }">
                <el-tooltip :content="row.hash" placement="top" :disabled="!isValid(row.hash)">
                  <router-link :to="`/tx?txHash=${row.hash}`">{{ formatTxHash(row.hash) }}</router-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="time" align="right" :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.time')"></el-table-column>
          </el-table>
        </div>
        <div class="table_pagination">
          <keep-alive>
            <m-pagination :pageSize="pageSize" :total="depositorCount" :page="currentDepositorPageNum" :page-change="pageChangeDepositor"></m-pagination>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { proposalStatus, proposalType, ColumnMinWidth, monikerNum,decimals,formatVoteOptions } from '../../constant'
import Tools from '../../util/Tools'
import { getProposalsDetailApi, getProposalDetailVotersApi, getProposalDetailDepositorApi } from '../../service/api'
import { addressRoute, converCoin, formatMoniker } from '@/helper/IritaHelper'
import MDepositCard from '../common/MDepositCard'
import MVotingCard from '../common/MVotingCard'
import MPagination from '.././common/MPagination'

export default {
  name: '',
  components: {
    MDepositCard,
    MVotingCard,
    MPagination,
  },
  props: {},
  data() {
    return {
      formatMoniker,
      monikerNum,
      ColumnMinWidth,
      addressRoute,
      proposalStatus,
      proposalType,
      title: '',
      type: '',
      status: '',
      proposer: '',
      submitHash: '',
      description: '',
      recipient: '',
      amount: '',
      parameterValue: '',
      name: '',
      time: '',
      height: '',
      info: '',
      submitAge: '',
      submitTime: '',
      depositEndAge: '',
      depositHourLeft: '',
      flShowDepositHourLeft: '',
      depositEndTime: '',
      depositHourTimer: null,
      flShowVotingHourLeft: '',
      votingHourLeft: '',
      totalDeposit: 0,
      burnValue: '',
      votingStartAge: '',
      votingStartTime: '',
      votingEndAge: '',
      votingEndTime: '',
      participationValue: 0,
      yesThresholdValue: 0,
      vetoThresholdValue: 0,
      currentParticipationValue: 0,
      currentYesValue: 0,
      currentNoValue: 0,
      currentNoWithVetoValue: 0,
      currentAbstainValue: 0,
      depositorObj: {},
      burnPercent: 0,
      votingObj: {},
      filterTabArr: [
        {
          label: 'All: ',
          key: 'all',
          value: '',
          isActive: true,
        },
        {
          label: 'Validator: ',
          key: 'validator',
          value: '',
          isActive: false,
        },
        {
          label: 'Delegator: ',
          key: 'delegator',
          value: '',
          isActive: false,
        },
      ],
      filterTab: 'all',
      pageSize: 10,
      voterCount: 0,
      currentVoterPageNum: 1,
      voteDetailsYes: '',
      voteDetailsNo: '',
      voteDetailsNoWithVeto: '',
      voteDetailsAbstain: '',
      voterData: [],
      depositorCount: 0,
      currentDepositorPageNum: 1,
      depositorData: [],
      upgradedClientState:''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getProposalsDetail()
    this.getVoter()
    this.getDepositor()
  },
  mounted() {},
  methods: {
    async getProposalsDetail() {
      try {
        let res = await getProposalsDetailApi(this.$route.params.proposal_id)
        if (res) {
          this.title = res.content.title ? `#${res.id} ${res.content.title}` : `#${res.id}`
          this.status = res.status
          this.proposer = res.proposer
          this.submitHash = res.hash
          let content = res.content
          if (content) {
            this.type = content.type
            this.description = content.description && content.description.trim()
            switch (content.type) {
              case proposalType.CommunityPoolSpendProposal:
                this.recipient = content.recipient
                let amount = await converCoin(content.amount && content.amount[0])
                this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`
                break
              case proposalType.SoftwareUpgradeProposal:
                let plan = content.plan
                if (plan) {
                  this.name = plan.name;
                  this.height = plan.height && plan.height !== '0' ? plan.height : '--';
                  this.info = plan.info || '--';
                  if(this.height && this.height !== '--') {
                    this.time = '--'
                  } else {
                    let timestamp = plan.time && Math.floor(new Date(plan.time).getTime() / 1000)
                    this.time = timestamp && Tools.getDisplayDate(timestamp)
                  }
                  this.upgradedClientState = plan.upgraded_client_state || '--'
                }
                break
              case proposalType.ParameterChangeProposal:
                ;(content.changes || []).forEach(param => {
                  this.parameterValue += `${param.subspace}/${param.key} = ${param.value}\n`
                })
                break
            }
          }
          this.submitTime = res.submit_time ? Tools.getDisplayDate(res.submit_time) : ''
          this.submitAge = res.submit_time ? Tools.formatAge(Tools.getTimestamp(), res.submit_time * 1000, 'ago') : ''
          this.depositEndTime = res.deposit_end_time ? Tools.getDisplayDate(res.deposit_end_time) : ''
          this.depositEndAge = res.deposit_end_time ? Tools.formatAge(Tools.getTimestamp(), res.deposit_end_time * 1000, 'ago') : ''
          res.deposit_end_time ? this.getDepositTime(res.deposit_end_time) : ''
          if (res.total_deposit && res.total_deposit.length !== 0) {
            let amount = await converCoin(res.total_deposit[0])
            this.totalDeposit = `${amount.amount} ${amount.denom.toUpperCase()}`
          }
          this.burnValue = `${(Number(res.burned_rate) * 100).toFixed(2)}`
          if(res.status !== proposalStatus.depositPeriod) {
            this.votingStartTime = res.voting_start_time ? Tools.getDisplayDate(res.voting_start_time) : ''
            this.votingStartAge = res.voting_start_time ? Tools.formatAge(Tools.getTimestamp(), res.voting_start_time * 1000, 'ago') : ''
            this.votingEndTime = res.voting_end_time ? Tools.getDisplayDate(res.voting_end_time) : ''
            this.votingEndAge = res.voting_end_time ? Tools.formatAge(Tools.getTimestamp(), res.voting_end_time * 1000, 'ago') : ''
            res.voting_end_time ? this.getVotingEndTime(res.voting_end_time) : ''
          } else {
            this.votingStartTime = '--',
            this.votingEndTime = '--'
          }
          this.participationValue = res.quorum && `${(Number(res.quorum) * 100).toFixed(2)}%`
          this.yesThresholdValue = res.threshold && `${(Number(res.threshold) * 100).toFixed(2)}%`
          this.vetoThresholdValue = res.veto_threshold && `${(Number(res.veto_threshold) * 100).toFixed(2)}%`
          if (res.current_tally_result) {
            let tally;
            if(res.current_tally_result.system_voting_power) {
              tally = res.current_tally_result;
              this.currentParticipationValue = tally.total_voting_power ? Tools.formatPercentageNumbers(tally.total_voting_power, tally.system_voting_power) : '0.00%';
            } else {
              tally = res.final_tally_result
              let total_voting_power = 0
              Object.values(res.final_tally_result).forEach(num => total_voting_power += num)
              tally.total_voting_power = total_voting_power
              this.currentParticipationValue = '0.00%'
            }
            this.currentYesValue = tally.yes ? Tools.formatPercentageNumbers(tally.yes, tally.total_voting_power) : '0.00%'
            this.currentNoValue = tally.no ? Tools.formatPercentageNumbers(tally.no, tally.total_voting_power) : '0.00%'
            this.currentNoWithVetoValue = tally.no_with_veto ? Tools.formatPercentageNumbers(tally.no_with_veto, tally.total_voting_power) : '0.00%'
            this.currentAbstainValue = tally.abstain ? Tools.formatPercentageNumbers(tally.abstain, tally.total_voting_power) : '0.00%'
          }
          this.burnPercent = Number(res.burned_rate)
          this.depositorObj = res
          this.votingObj = res
        }
      } catch (e) {
        console.error(e)
      }
    },
    getDepositTime(time) {
      if (time) {
        clearInterval(this.depositHourTimer)
        let that = this
        let currentServerTime = Tools.getTimestamp()
        if (new Date(time).getTime() > currentServerTime) {
          that.depositHourLeft = Tools.formatAge(new Date(time).getTime(), currentServerTime * 1000)
          that.flShowDepositHourLeft = true
        } else {
          that.flShowDepositHourLeft = false
        }
        this.depositHourTimer = setInterval(() => {
          let currentServerTime = Tools.getTimestamp()
          if (new Date(time).getTime() > currentServerTime) {
            that.depositHourLeft = Tools.formatAge(new Date(time).getTime(), currentServerTime * 1000)
            that.flShowDepositHourLeft = true
          } else {
            that.flShowDepositHourLeft = false
          }
        }, 1000)
      }
    },
    getVotingEndTime(time) {
      if (time) {
        clearInterval(this.votingHourTimer)
        let that = this
        let currentServerTime = Tools.getTimestamp()
        if (new Date(time).getTime() > currentServerTime) {
          that.votingHourLeft = Tools.formatAge(new Date(time).getTime(), currentServerTime * 1000)
          that.flShowVotingHourLeft = true
        } else {
          that.flShowVotingHourLeft = false
        }
        this.votingHourTimer = setInterval(() => {
          let currentServerTime = Tools.getTimestamp()
          if (new Date(time).getTime() > currentServerTime) {
            that.votingHourLeft = Tools.formatAge(new Date(time).getTime(), currentServerTime * 1000)
            that.flShowVotingHourLeft = true
          } else {
            that.flShowVotingHourLeft = false
          }
        }, 1000)
      }
    },
    pageChangeVoter(pageNum) {
      this.currentVoterPageNum = pageNum
      this.getVoter()
    },
    pageChangeDepositor(pageNum) {
      this.currentDepositorPageNum = pageNum
      this.getDepositor()
    },
    async filterVoteTx(item, index) {
      this.currentVoterPageNum = 1
      this.filterTab = item
      this.resetActiveStyle()
      this.filterTabArr[index].isActive = true
      await this.getVoter()
    },
    resetActiveStyle() {
      this.filterTabArr.map(item => {
        return (item.isActive = false)
      })
    },
    isValid(value) {
      return !value || !value.length || value == '--' ? false : true
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    async getVoter() {
      try {
        let res = await getProposalDetailVotersApi(this.$route.params.proposal_id, this.currentVoterPageNum, this.pageSize, true, this.filterTab)
        if (res) {
          this.voterCount = res.count
          this.voterData = []
          if (res.data && res.data.length > 0) {
            this.voterData = res.data.map(voter => {
              return {
                voter: voter.voter,
                address: voter.address,
                isValidator: voter.isValidator,
                moniker: voter.moniker,
                option: formatVoteOptions[voter.option],
                block: voter.height,
                hash: voter.hash,
                time: voter.timestamp ? Tools.getDisplayDate(voter.timestamp) : '--',
              }
            })
          }
          let statistical = res.statistical
          if (statistical) {
            this.filterTabArr.forEach(item => {
              item.value = statistical[item.key]
            })
            this.voteDetailsYes = statistical.yes
            this.voteDetailsNo = statistical.no
            this.voteDetailsNoWithVeto = statistical.no_with_veto
            this.voteDetailsAbstain = statistical.abstain
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    async getDepositor() {
      try {
        let res = await getProposalDetailDepositorApi(this.$route.params.proposal_id, this.currentDepositorPageNum, this.pageSize, true)
        if (res) {
          this.depositorCount = res.count
          this.depositorData = []
          if (res.data && res.data.length > 0) {
            for (const depositor of res.data) {
              let amount = '--'
              if (depositor.amount && depositor.amount.length > 0) {
                let n = await converCoin(depositor.amount[0])
                amount = `${Tools.formatPriceToFixed(n.amount,decimals.amount)} ${n.denom.toLocaleUpperCase()}`
              }
              this.depositorData.push({
                depositor: depositor.address,
                moniker: depositor.moniker,
                amount,
                type: depositor.type,
                hash: depositor.hash,
                time: depositor.timestamp ? Tools.getDisplayDate(depositor.timestamp) : '--',
              })
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.proposals_detail_wrap {
  font-size: $s14;
  .proposals_detail_content {
    max-width: 12rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    text-align: left;
    .proposals_detail_title_container {
      margin: 0.28rem 0 0.1rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
      span {
        margin-right: 0.2rem;
      }
    }
  }
  .proposals_detail_information {
    margin: 0.15rem 0;
    .level_container {
      display: flex;
      margin: 0 0 0.1rem 0;
      .proposals_detail_type {
        margin: 0 0.2rem 0 0rem;
        i {
          padding-right: 0.1rem;
        }
      }
      .step_content {
        margin-right: 0.4rem;
        i {
          padding-right: 0.1rem;
        }
      }
      .time_content {
        margin-right: 0.4rem;
        span {
          i {
            padding-right: 0.1rem;
          }
        }
      }
    }
    .proposals_detail_information_wrap {
      padding: 0.2rem 0.2rem 0.08rem;
      // border: 1px solid $bd_second_c;
      background: $bg_white_c;
      .information_props_wrap {
        display: flex;
        line-height: 0.2rem;
        margin-bottom: 0.12rem;
        .information_value {
          word-break: break-all;
        }
        .information_props {
          min-width: 1.6rem;
          color: $t_second_c;
        }
        .jump_route {
            word-break: break-all
        }
      }
    }
  }
  .proposal_detail_content {
    display: flex;
    margin-top: 0.2rem;
    .proposals_detail_information_wrap {
      flex: 1;
      // border: 0.01rem solid $bd_second_c;
      background: $bg_white_c;
    }
    .proposals_detail_information_wrap:first-child {
      margin-right: 0.1rem;
      background: $bg_white_c;
    }
  }
  .card_container {
    display: flex;
    width: 100%;
    margin: 0 auto;
    max-width: 12.8rem;
    div {
      flex: 1;
    }
    .deposit_card_content_wrap {
      padding: 0;
    }
    .voting_proposal_card_content {
      // min-width: 5rem;
    }
    .voting_mobile_content {
      margin-left: 0.1rem;
    }
  }
  .proposal_table {
    margin: 0.2rem 0;
    .proposal_table_title{
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    }
    .proposals_table_title_div {
      font-size: $s18;
      margin: 0.3rem 0.2rem 0.1rem 0rem;
      color: $t_first_c;
    }
    .filter_content {
      flex: 1;
      display: flex;
      .tab_option {
        font-size: $s12;
        margin: 0 0 0.1rem;
        cursor: pointer;
        span {
          padding-right: 0.1rem;
        }
      }
      .tab_option:last-child {
        span:last-child {
          display: none;
        }
      }
      .blue_style {
        color: $theme_c;
      }
    }
    .voting_options {
      display: flex;
      color: $t_second_c;
      margin-bottom: 10px;
      flex-wrap: wrap;
      align-items: center;
      .yes_option_style {
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 0.02rem;
        background: $theme_c;
        margin-right: 0.1rem;
      }
      .no_option_style {
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 0.02rem;
        background: #ffcf65;
        margin-right: 0.1rem;
      }
      .no_with_veto_option_style {
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 0.02rem;
        background: #fe8a8a;
        margin-right: 0.1rem;
      }
      .abstain_option_style {
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 0.02rem;
        background: #ccdcff;
        margin-right: 0.1rem;
      }
      & > span {
        font-size: 0.14rem;
        color: $t_second_c;
        padding: 0 0.18rem;
        white-space: nowrap;
        display: flex;
        align-items: center;
        line-height: 0.3rem;
        & > span {
          color: $t_second_c;
        }
      }
    }
    .table_pagination {
      margin: 0.1rem 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
@media screen and (max-width: 910px) {
  .proposals_detail_wrap {
      .proposal_detail_content {
        display: block;
        .proposals_detail_information_wrap {
          margin-right: 0 !important;
          margin-bottom: 0.1rem;
        }
      }
      .card_container {
        display: block;
        .voting_mobile_content {
          margin-left: 0;
        }
      }
  }
}
@media screen and (max-width: 845px) {
  .proposals_detail_wrap {
      .proposal_table {
        .proposal_table_title{
          display: block;
          .proposals_table_title_div {
            margin: 0.3rem 0.1rem 0.1rem 0rem;
          }
          .filter_content {
            // margin-left: 0.1rem;
          }
          .voting_options {
            span {
              padding: 0 0.08rem;
            }
            .first {
              padding: 0 0.08rem 0 0;
            }
          }
        }
        .proposals_table_title_div {
          margin: 0.3rem 0.1rem 0.1rem 0rem;
        }
      }
  }
}
@media screen and (max-width: 555px) {
  .proposals_detail_wrap {
      .proposal_detail_content {
        display: block;
        .proposals_detail_information_wrap {
          .information_props_wrap {
            display: flex;
            flex-direction: column;
          }
        }
      }
      .card_container {
        .voting_mobile_content {
        }
      }
      .proposals_detail_information {
        .proposals_detail_information_wrap {
          .information_props_wrap {
            display: flex;
            flex-direction: column;
          }
        }
      }
  }
}
@media screen and (max-width: 469px) {
  .proposals_detail_wrap {
    .proposals_detail_content {
      .proposals_detail_title_container {
        display: block;
        margin-left: 0.18rem;
        span {
          display: block;
        }
      }
    }
  }
  .information_props {
    min-width: 1.5rem !important;
  }
}

</style>
