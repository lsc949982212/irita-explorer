<template>
    <div class="voting_card_content">
        <div class="title_container" v-if="showTitle">
            <div class="title_content">
                <router-link :to="`/ProposalsDetail/${proposalId}`">
                    <span class="proposal_id_content">#{{proposalId}}</span>
                    <span class="proposal_title">{{title}}</span>
                </router-link>
            </div>
            <div class="view_all_content">
                <span><router-link :to="`/gov/proposals`">{{ $t('ExplorerLang.gov.proposalDetail.viewAll') }}</router-link></span>
            </div>
        </div>
        <div class="voting_title_container" :class="showTitle ? 'home_style': ''">
            <div>
                <span><i :style="{color:flHighlightParticipation ? 'var(--bgColor)' : '#D7DCE0'}" class="iconfont iconBondedTokens"></i>{{ $t('ExplorerLang.gov.participation') }} {{participationThreshold}}</span>
                <span><i :style="{color:flShowPassThreshold ? 'var(--bgColor)' : '#D7DCE0'}" class="iconfont iconBondedTokens"></i>{{ $t('ExplorerLang.gov.passThreshold') }} {{passThreshold}}</span>
            </div>
            <div class="voting_card_right_content">
                <span><i :style="{color:flShowVoteThreshold ? '#FE8A8A' : '#D7DCE0'}" class="iconfont iconBondedTokens"></i>{{ $t('ExplorerLang.gov.vetoThreshold') }} {{voteThreshold}}</span>
                <div v-if="flShowHourLeft">
                    <span><i style="color:#5AC8FA;" class="iconfont iconHoursLeft"></i>{{hourLeft}} Left</span>
                </div>
            </div>
        </div>
        <div class="voting_content">
            <div class="voting_left_container">
                <span class="delegator_voted_content" v-show="flShowTotalVoted">0.00%</span>
                <span class="delegator_voted_content" v-show="!flShowTotalVoted">0.00%</span>
                <span class="yes_content">{{ $t('ExplorerLang.gov.proposalDetail.yes') }} {{yesVotingPowerWidth}}</span>
                <span class="no_content">{{ $t('ExplorerLang.gov.proposalDetail.no') }} {{noVotingPowerWidth}}</span>
            </div>
            <div class="voting_center_container">
                <div class="voting_progress_bar_content">
                    <span class="min_value_content" :style="minTotalTipStyleNumber" v-show="flShowTotalVoted">
                        <span class="min_value_title">{{delegatorVoted}}% by Delegator</span>
                    </span>
                    <div class="default_progress_bar_content" :style="{background: totalVoted !== '0.00%' || delegatorVoted !== '0.00%' ? 'var(--bgColor)' : ''}"></div>
                    <div class="min_deposit_bar_content" :style="minVotingPowerStyleObj"></div>
                </div>
                <div class="voting_bottom_progress_bar_content" :style="{background: totalVoted !== '0.00%' || delegatorVoted !== '0.00%' ? 'var(--bgColor)' : '#E5E9FB'}">
                    <div class="voting_bottom_min_deposit_bar_content" :style="yesVotingPowerStyleObj"></div>
                    <div class="voting_bottom_total_deposit_bar_content" :style="noVotingPowerStyleObj"></div>
                    <div class="voting_bottom_default_progress_bar_content" :style="abstainVotingPowerStyleObj"></div>
                    <div class="voting_bottom_burned_progress_bar_content" :style="vetoVotingPowerStyleObj"></div>
                </div>
            </div>
            <div class="voting_right_container">
                <span class="participation_threshold_content" v-show="flShowTotalVoted">{{totalVoted ? totalVoted : '0.00'}} {{ $t('ExplorerLang.gov.proposalDetail.participation') }}</span>
                <span class="participation_threshold_content" v-show="!flShowTotalVoted">{{delegatorVoted ? delegatorVoted : '0.00'}} {{ $t('ExplorerLang.gov.proposalDetail.participation') }}</span>
                <span class="veto_content">{{vetoVotingPowerWidth}} {{ $t('ExplorerLang.gov.proposalDetail.noWithVeto') }}</span>
                <span class="abstain_content">{{abstainVotingPowerWidth}} {{ $t('ExplorerLang.gov.proposalDetail.abstain') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Tools from "../../util/Tools"
	export default {
		name: "MVotingCard",
        props:{
	        votingBarObj:{
				type: Object
            },
	        showTitle:{
		        type: Boolean
	        }
        },
        watch:{
	        votingBarObj(votingBarObj){
                let copyVotingBarObj = JSON.parse(JSON.stringify(votingBarObj));
	        	this.formatVotingBarObj(copyVotingBarObj)
            }
        },

        data(){
			return {
                totalVoted: '',
				proposalId:'',
				title:'',
                participationThreshold:'',
				hourLeft: '',
                validatorVotedPower: '',
                delegatorVotedPower: '',
                delegatorVoted:'',
                systemVotingPower:'',
				totalVotedNumber:'',
				yesVotingPowerWidth:'',
				noVotingPowerWidth:'',
				vetoVotingPowerWidth:'',
				abstainVotingPowerWidth:'',
                passThreshold:'',
                voteThreshold:'',
				flShowHourLeft: false,
                flShowPassThreshold:false,
                flShowVoteThreshold:false,
                totalVotedGreaterThan: false,
                flShowTotalVoted:false,
				flHighlightParticipation:false,
                votingTimer:null,
				minVotingPowerStyleObj:{
                	width:""
                },
				minVotingPowerStyleNumber:'',
                minTotalTipStyleNumber:{
	                left:""
                },
                yesVotingPowerStyleObj:{
	                width:""
                },
				noVotingPowerStyleObj:{
					width:""
				},
                vetoVotingPowerStyleObj:{
	                width:""
                },
				abstainVotingPowerStyleObj:{
					width:""
				}
            }
        },
		mounted(){
			let copyVotingBarObj = JSON.parse(JSON.stringify(this.votingBarObj));
			this.formatVotingBarObj(copyVotingBarObj)
        },
        methods:{
	        formatVotingBarObj(votingBarObj){
	        	if(votingBarObj){
			        this.title = votingBarObj.content && votingBarObj.content.title;
			        this.proposalId = votingBarObj.id;
			        this.participationThreshold = votingBarObj.quorum && `${(Number(votingBarObj.quorum) * 100).toFixed(2)}%`;
			        this.passThreshold = votingBarObj.threshold && `${(Number(votingBarObj.threshold) * 100).toFixed(2)}%`;
			        this.voteThreshold = votingBarObj.veto_threshold && `${(Number(votingBarObj.veto_threshold) * 100).toFixed(2)}%`;
                    this.getVotingEndTime(votingBarObj.voting_end_time);
                    let currentTally;
                    if(votingBarObj.current_tally_result && votingBarObj.current_tally_result.system_voting_power) {
                        currentTally = votingBarObj.current_tally_result;
                    } else {
                        currentTally = votingBarObj.final_tally_result;
                    }
                    if(currentTally) {
                        this.systemVotingPower = currentTally.system_voting_power;
                        this.yesVotingPowerWidth = currentTally.yes ? Tools.formatPercentageNumbers(currentTally.yes,currentTally.total_voting_power): '0.00%';
                        if(Tools.formatPercentageNumbers(currentTally.yes,currentTally.total_voting_power,'') > Number(votingBarObj.threshold)*100) {
                            this.flShowPassThreshold = true
                        }
                        // console.log('yes',Tools.formatPercentageNumbers(currentTally.yes,currentTally.total_voting_power,''))
                        this.$set(this.yesVotingPowerStyleObj,'width',`${this.yesVotingPowerWidth}`);
                        this.noVotingPowerWidth = currentTally.no ? Tools.formatPercentageNumbers(currentTally.no,currentTally.total_voting_power) : '0.00%';
                        this.$set(this.noVotingPowerStyleObj,'width',`${this.noVotingPowerWidth}`);
                        this.vetoVotingPowerWidth = currentTally.no_with_veto ? Tools.formatPercentageNumbers(currentTally.no_with_veto,currentTally.total_voting_power) :'0.00%';
                        if(Tools.formatPercentageNumbers(currentTally.no_with_veto,currentTally.total_voting_power,'') > Number(votingBarObj.veto_threshold)*100) {
                            this.flShowVoteThreshold = true
                        }
                        // console.log('不同意',Tools.formatPercentageNumbers(currentTally.no_with_veto,currentTally.total_voting_power,''))
                        this.$set(this.vetoVotingPowerStyleObj,'width',`${this.vetoVotingPowerWidth}`);
                        this.abstainVotingPowerWidth = currentTally.abstain ? Tools.formatPercentageNumbers(currentTally.abstain,currentTally.total_voting_power) :'0.00%';
                        this.$set(this.abstainVotingPowerStyleObj,'width',`${this.abstainVotingPowerWidth}`);
                        this.totalVoted = currentTally.total_voting_power && currentTally.system_voting_power  ? Tools.formatPercentageNumbers(currentTally.total_voting_power,currentTally.system_voting_power) : '0.00%';
                        if(Tools.formatPercentageNumbers(currentTally.total_voting_power,currentTally.system_voting_power,'') > Number(votingBarObj.quorum)*100) {
                            this.flHighlightParticipation = true
                        }
                        this.delegatorVoted = currentTally.total_voting_power && currentTally.system_voting_power ? Tools.formatPercentageNumbers(currentTally.total_voting_power,currentTally.system_voting_power) : '0.00%';
                        this.$set(this.minTotalTipStyleNumber,'left',`${this.delegatorVoted}`);
                    }
                }
            },
	        getVotingEndTime(time){
		        if(time){
			        let that = this;
			        let currentServerTime = Tools.getTimestamp();
			        if(new Date(time).getTime() >  currentServerTime){
				        that.hourLeft = Tools.formatAge(new Date(time).getTime(),currentServerTime * 1000);
				        that.flShowHourLeft = true;
			        }
		        	clearInterval(this.votingTimer);
			        this.votingTimer = setInterval(() => {
				        currentServerTime = Tools.getTimestamp();
				        if(new Date(time).getTime() >  currentServerTime){
					        that.hourLeft = Tools.formatAge(new Date(time).getTime(),currentServerTime * 1000);
					        that.flShowHourLeft = true;
				        }else {
					        that.flShowHourLeft = false;
				        }
                    },1000)
		        }
	        },
        }
	}
</script>

<style scoped lang="scss">
    .voting_card_content{
        flex: 1;
        justify-content: space-between;
        min-height: 2rem;
        background: $bg_white_c;
        box-sizing: border-box;
        padding: 0.2rem;
        // border: 0.01rem solid $bd_second_c;
        margin: 0 0 0.2rem 0;
        .title_container{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title_content{
                line-height: 1;
                font-size: 0.16rem;
                .proposal_id_content{
                    color: $t_second_c;
                    margin-right: 0.1rem;
                }
                .proposal_title{
                    color: $theme_c;
                }
            }
            .view_all_content{
                color: $theme_c;
                span{
                    line-height: 1;
                    border-bottom: 0.01rem solid $theme_c;
                    a{
                        font-size: $s14;
                        color: $theme_c !important;
                    }
                }
            }

        }
        .voting_title_container{
            font-size: 0.12rem;
            display: flex;
            i{
                margin-right: 0.06rem;
                font-size: $s14;
            }
            .iconHoursLeft{
                color: $t_second_c;
            }
            span{
                margin-right: 0.08rem;
                color: $t_first_c;
            }
            .voting_card_right_content{
                display: flex;
            }
        }
        .home_style{
            margin-top: 0.1rem;
        }
        .voting_content{
            margin-top: 0.5rem;
            display: flex;
            .voting_left_container{
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .delegator_voted_content{
                    color: $t_first_c;
                    font-size: $s12;
                    line-height: 0.14rem;
                }
                .yes_content{
                    color: $t_first_c;
                    font-size: $s12;
                    line-height: 0.14rem;
                    margin-top: 0.26rem;
                }
                .no_content{
                    font-size: $s12;
                    color: $t_first_c;
                    line-height: 0.14rem;
                    margin-top: 0.1rem;
                }
            }
            .voting_center_container{
                flex: 1;
                width: 100%;
                margin: 0 0.1rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .voting_progress_bar_content{
                    flex: 1;
                    width: 100%;
                    position: relative;
                    bottom: 0.07rem;
                    margin-top: 0.06rem;
                    .min_value_content{
                        color: #FF9942;
                        bottom: 0.5rem;
                        position: absolute;
                        .min_value_title{
                            position: relative;
                            display: inline-block;
                            right: 30%;
                            width: 100%;
                            white-space: nowrap;
                            font-size: $s12;
                            margin-bottom: 0.08rem;
                            &:after{
                                width: 0;
                                height: 0;
                                border: 0.06rem solid transparent;
                                content: "";
                                display: block;
                                position: absolute;
                                border-top-color: #FF9942;
                                left: 24%;
                                bottom: -0.12rem;
                            }
                        }
                    }
                    .default_progress_bar_content{
                        width: 100%;
                        height: 0.12rem;
                        border-radius: 0.06rem;
                        position: absolute;
                        z-index: 7;
                        background: #E5E9FB;
                    }
                    .burned_progress_bar_content{
                        width: 30%;
                        height: 0.12rem;
                        border-radius: 0.06rem;
                        position: absolute;
                        background: #D25F59;
                        z-index: 1;
                    }
                    .min_deposit_bar_content{
                        background: $theme_c;
                        height: 0.12rem;
                        border-radius: 0.06rem;
                        position: absolute;
                        z-index: 2;
                    }
                }
                .voting_bottom_progress_bar_content{
                    margin-bottom: 0.14rem;
                    display: flex;
                    align-items: center;
                    border-radius: 0.06rem;
                    overflow: hidden;
                    height: 0.12rem;
                    .voting_bottom_default_progress_bar_content{
                        height: 0.12rem;
                        background: #CCDCFF;
                        z-index: 1;
                    }
                    .voting_bottom_burned_progress_bar_content{
                        height: 0.12rem;
                        background: #FE8A8A;
                        z-index: 1;
                    }
                    .voting_bottom_min_deposit_bar_content{
                        background: $theme_c;
                        height: 0.12rem;
                        z-index: 2;
                    }
                    .voting_bottom_total_deposit_bar_content{
                        background: #FFCF65;
                        height: 0.12rem;
                        z-index: 1;
                    }
                }
            }
            .voting_right_container{
                display: flex;
                flex-direction: column;
                .participation_threshold_content{
                    color: $t_first_c;
                    font-size: $s12;
                    line-height: 0.14rem;
                }
                .veto_content{
                    color: $t_first_c;
                    font-size: $s12;
                    line-height: 0.14rem;
                    margin-top: 0.26rem;
                }
                 .abstain_content{
                    font-size: $s12;
                    color: $t_first_c;
                    line-height: 0.14rem;
                    margin-top: 0.1rem;
                 }
            }
        }
    }
    @media screen and (max-width: 1280px){
        .voting_title_container{
            flex-direction: column;
            .voting_card_right_content{
                display: flex;
            }
        }
    }
    @media screen and (max-width: 910px){
        .voting_card_content{
            margin: 0 ;
        }

    }
</style>
